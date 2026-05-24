const mongoose = require('mongoose');
const { ChecklistRealtime, ChatDivisi, Notifikasi, PerubahanRundown, LogKoordinasi } = require('../models/nosql');
const { successResponse, errorResponse } = require('../utils/response');

function ensureMongoConnected(res) {
  if (mongoose.connection.readyState !== 1) {
    errorResponse(res, {
      message: 'Fitur realtime tidak tersedia karena MongoDB belum terhubung',
      statusCode: 503,
    });
    return false;
  }

  return true;
}

function parsePositiveInteger(value) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) {
    return null;
  }
  return number;
}

function formatRealtimeDoc(doc) {
  if (!doc) {
    return null;
  }

  const payload = doc.toObject ? doc.toObject() : doc;
  return {
    id: String(payload._id),
    ...payload,
    _id: undefined,
  };
}

async function createChecklist(req, res, next) {
  try {
    if (!ensureMongoConnected(res)) {
      return;
    }

    const { tugas_id, event_id, user_id, status = 'belum', catatan = null, location = null } = req.body;

    if (!tugas_id || !event_id) {
      return errorResponse(res, {
        message: 'tugas_id dan event_id wajib diisi',
        statusCode: 400,
      });
    }

    const assignedUserId = req.auth?.role === 'admin' ? (user_id || req.auth?.id) : req.auth?.id;

    const checklist = await ChecklistRealtime.create({
      tugas_id,
      event_id,
      user_id: assignedUserId,
      status,
      catatan,
      location,
    });

    return successResponse(res, {
      message: 'Checklist realtime berhasil dibuat',
      data: { checklist: formatRealtimeDoc(checklist) },
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

async function listChecklistByEvent(req, res, next) {
  try {
    if (!ensureMongoConnected(res)) {
      return;
    }

    const eventId = parsePositiveInteger(req.params.eventId);
    if (!eventId) {
      return errorResponse(res, { message: 'eventId tidak valid', statusCode: 400 });
    }

    const checklist = await ChecklistRealtime.find({ event_id: eventId }).sort({ updated_at: -1 });

    return successResponse(res, {
      message: 'Checklist realtime berhasil diambil',
      data: { checklist: checklist.map(formatRealtimeDoc) },
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

async function updateChecklistStatus(req, res, next) {
  try {
    if (!ensureMongoConnected(res)) {
      return;
    }

    const checklistId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(checklistId)) {
      return errorResponse(res, { message: 'ID checklist tidak valid', statusCode: 400 });
    }

    const { status, catatan = undefined, location = undefined } = req.body;
    if (!status) {
      return errorResponse(res, { message: 'status wajib diisi', statusCode: 400 });
    }

    const checklist = await ChecklistRealtime.findById(checklistId);
    if (!checklist) {
      return errorResponse(res, { message: 'Checklist tidak ditemukan', statusCode: 404 });
    }

    const isAdmin = req.auth?.role === 'admin';
    if (!isAdmin && checklist.user_id !== req.auth?.id) {
      return errorResponse(res, { message: 'Tidak punya izin', statusCode: 403 });
    }

    checklist.status = status;
    if (catatan !== undefined) {
      checklist.catatan = catatan;
    }
    if (location !== undefined) {
      checklist.location = location;
    }

    await checklist.save();

    return successResponse(res, {
      message: 'Checklist realtime berhasil diperbarui',
      data: { checklist: formatRealtimeDoc(checklist) },
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

async function sendChatMessage(req, res, next) {
  try {
    if (!ensureMongoConnected(res)) {
      return;
    }

    const { event_id, divisi, pesan, tipe = 'text', file_url = null } = req.body;

    if (!event_id || !divisi || !pesan) {
      return errorResponse(res, {
        message: 'event_id, divisi, dan pesan wajib diisi',
        statusCode: 400,
      });
    }

    const message = await ChatDivisi.create({
      event_id,
      divisi,
      pesan,
      pengirim_id: req.auth?.id,
      pengirim_nama: req.auth?.name || req.auth?.email || `user-${req.auth?.id}`,
      tipe,
      file_url,
    });

    return successResponse(res, {
      message: 'Pesan chat berhasil dikirim',
      data: { message: formatRealtimeDoc(message) },
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

async function listChatByEvent(req, res, next) {
  try {
    if (!ensureMongoConnected(res)) {
      return;
    }

    const eventId = parsePositiveInteger(req.params.eventId);
    if (!eventId) {
      return errorResponse(res, { message: 'eventId tidak valid', statusCode: 400 });
    }

    const filter = { event_id: eventId };
    if (req.query.divisi) {
      filter.divisi = req.query.divisi;
    }

    const messages = await ChatDivisi.find(filter).sort({ created_at: -1 }).limit(200);

    return successResponse(res, {
      message: 'Riwayat chat berhasil diambil',
      data: { messages: messages.map(formatRealtimeDoc) },
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

async function createNotification(req, res, next) {
  try {
    if (!ensureMongoConnected(res)) {
      return;
    }

    const { user_id, event_id, judul, pesan, tipe } = req.body;

    if (!user_id || !event_id || !judul || !pesan || !tipe) {
      return errorResponse(res, {
        message: 'user_id, event_id, judul, pesan, dan tipe wajib diisi',
        statusCode: 400,
      });
    }

    const notification = await Notifikasi.create({
      user_id,
      event_id,
      judul,
      pesan,
      tipe,
      is_read: false,
    });

    return successResponse(res, {
      message: 'Notifikasi berhasil dibuat',
      data: { notification: formatRealtimeDoc(notification) },
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

async function listMyNotifications(req, res, next) {
  try {
    if (!ensureMongoConnected(res)) {
      return;
    }

    const limit = Math.min(parsePositiveInteger(req.query.limit) || 50, 100);

    const notifications = await Notifikasi.find({ user_id: req.auth?.id })
      .sort({ created_at: -1 })
      .limit(limit);

    return successResponse(res, {
      message: 'Notifikasi user berhasil diambil',
      data: { notifications: notifications.map(formatRealtimeDoc) },
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

async function markNotificationRead(req, res, next) {
  try {
    if (!ensureMongoConnected(res)) {
      return;
    }

    const notificationId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return errorResponse(res, { message: 'ID notifikasi tidak valid', statusCode: 400 });
    }

    const notification = await Notifikasi.findById(notificationId);
    if (!notification) {
      return errorResponse(res, { message: 'Notifikasi tidak ditemukan', statusCode: 404 });
    }

    const isAdmin = req.auth?.role === 'admin';
    if (!isAdmin && notification.user_id !== req.auth?.id) {
      return errorResponse(res, { message: 'Tidak punya izin', statusCode: 403 });
    }

    notification.is_read = true;
    await notification.save();

    return successResponse(res, {
      message: 'Notifikasi ditandai sudah dibaca',
      data: { notification: formatRealtimeDoc(notification) },
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

async function createRundownChange(req, res, next) {
  try {
    if (!ensureMongoConnected(res)) {
      return;
    }

    const { rundown_id, event_id, field_berubah, nilai_lama = null, nilai_baru, alasan = null } = req.body;

    if (!rundown_id || !event_id || !field_berubah || nilai_baru === undefined) {
      return errorResponse(res, {
        message: 'rundown_id, event_id, field_berubah, dan nilai_baru wajib diisi',
        statusCode: 400,
      });
    }

    const change = await PerubahanRundown.create({
      rundown_id,
      event_id,
      field_berubah,
      nilai_lama: nilai_lama !== null ? String(nilai_lama) : null,
      nilai_baru: String(nilai_baru),
      diubah_oleh: req.auth?.id,
      alasan,
    });

    return successResponse(res, {
      message: 'Log perubahan rundown berhasil dibuat',
      data: { change: formatRealtimeDoc(change) },
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

async function listRundownChangesByEvent(req, res, next) {
  try {
    if (!ensureMongoConnected(res)) {
      return;
    }

    const eventId = parsePositiveInteger(req.params.eventId);
    if (!eventId) {
      return errorResponse(res, { message: 'eventId tidak valid', statusCode: 400 });
    }

    const changes = await PerubahanRundown.find({ event_id: eventId }).sort({ timestamp: -1 }).limit(200);

    return successResponse(res, {
      message: 'Riwayat perubahan rundown berhasil diambil',
      data: { changes: changes.map(formatRealtimeDoc) },
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

async function createKoordinasiLog(req, res, next) {
  try {
    if (!ensureMongoConnected(res)) {
      return;
    }

    const { event_id, aksi, entity, entity_id, detail = {} } = req.body;

    if (!event_id || !aksi || !entity || !entity_id) {
      return errorResponse(res, {
        message: 'event_id, aksi, entity, dan entity_id wajib diisi',
        statusCode: 400,
      });
    }

    const log = await LogKoordinasi.create({
      event_id,
      user_id: req.auth?.id,
      aksi,
      entity,
      entity_id,
      detail,
      ip_address: req.ip,
    });

    return successResponse(res, {
      message: 'Log koordinasi berhasil dicatat',
      data: { log: formatRealtimeDoc(log) },
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

async function listKoordinasiLogByEvent(req, res, next) {
  try {
    if (!ensureMongoConnected(res)) {
      return;
    }

    const eventId = parsePositiveInteger(req.params.eventId);
    if (!eventId) {
      return errorResponse(res, { message: 'eventId tidak valid', statusCode: 400 });
    }

    const logs = await LogKoordinasi.find({ event_id: eventId }).sort({ timestamp: -1 }).limit(300);

    return successResponse(res, {
      message: 'Log koordinasi berhasil diambil',
      data: { logs: logs.map(formatRealtimeDoc) },
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createChecklist,
  listChecklistByEvent,
  updateChecklistStatus,
  sendChatMessage,
  listChatByEvent,
  createNotification,
  listMyNotifications,
  markNotificationRead,
  createRundownChange,
  listRundownChangesByEvent,
  createKoordinasiLog,
  listKoordinasiLogByEvent,
};
