import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/eventService';
import { tugasService } from '../services/tugasService';
import { rundownService } from '../services/rundownService';
import { vendorService } from '../services/vendorService';
import { userService } from '../services/userService';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import FileUploadInput from '../components/ui/Fileuploadinput'; // Fix #3
import { useToast } from '../components/ui/Toast';
import { formatDate, formatDateTime } from '../utils/formatters';

const TABS = ['Ringkasan', 'Rundown', 'Vendor', 'Tugas', 'Laporan'];

// Form defaults
const VENDOR_INIT  = { nama_vendor: '', kategori: '', kontak_person: '', telepon: '', email: '', alamat: '', status: 'aktif', catatan: '' };
const RUNDOWN_INIT = { urutan: '', waktu_mulai: '', waktu_selesai: '', judul_sesi: '', deskripsi: '', pic_id: '', vendor_id: '', status: 'belum' };
const TUGAS_INIT   = { judul: '', deskripsi: '', assignee_id: '', divisi: '', prioritas: 'sedang', deadline: '', catatan: '', rundown_id: '', lampiran_url: '' };
const LAPORAN_INIT = { judul: '', konten: '', file_url: '', tanggal: new Date().toISOString().split('T')[0] };
const EVENT_EDIT_INIT = { nama_event: '', deskripsi: '', lokasi: '', tanggal_mulai: '', tanggal_selesai: '', status: 'draft' };

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canManage, isAdmin, user } = useAuth();
  const toast = useToast();

  // Core state
  const [event,   setEvent]   = useState(null);
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('Ringkasan');

  // Tab data
  const [rundowns, setRundowns] = useState([]);
  const [vendors,  setVendors]  = useState([]);
  const [tugas,    setTugas]    = useState([]);
  const [laporan,  setLaporan]  = useState([]);
  const [tabMeta,    setTabMeta]    = useState(null);
  const [tabPage,    setTabPage]    = useState(1);
  const [tabLoading, setTabLoading] = useState(false);

  // Users list for selects
  const [users, setUsers] = useState([]);

  // Saving flag
  const [saving, setSaving] = useState(false);

  // Fix #4: Edit Event modal
  const [editEventModal, setEditEventModal] = useState(false);
  const [editEventForm,  setEditEventForm]  = useState(EVENT_EDIT_INIT);
  const [deletingEvent,  setDeletingEvent]  = useState(false);

  // Vendor modal
  const [vendorModal, setVendorModal] = useState({ open: false, data: null });
  const [vendorForm,  setVendorForm]  = useState(VENDOR_INIT);

  // Rundown modal
  const [rundownModal, setRundownModal] = useState({ open: false, data: null });
  const [rundownForm,  setRundownForm]  = useState(RUNDOWN_INIT);

  // Tugas modal
  const [tugasModal, setTugasModal] = useState({ open: false });
  const [tugasForm,  setTugasForm]  = useState(TUGAS_INIT);

  // Laporan modal
  const [laporanModal, setLaporanModal] = useState({ open: false });
  const [laporanForm,  setLaporanForm]  = useState(LAPORAN_INIT);

  // ─── Fetch event detail ────────────────────────────────────
  useEffect(() => {
    eventService.getById(id)
      .then(res => {
        setEvent(res.data.data.event);
        setStats(res.data.data.statistics);
      })
      .catch(() => navigate('/events'))
      .finally(() => setLoading(false));
  }, [id]);

  // ─── Fetch users for selects (admin/ketua only) ──────────
  useEffect(() => {
    if (!canManage) return;
    userService.list({ per_page: 100 })
      .then(res => setUsers(res.data.data.users || []))
      .catch(console.error);
  }, [canManage]);

  // ─── Fetch tab data ────────────────────────────────────────
  useEffect(() => {
    if (!event) return;
    setTabLoading(true);
    const params = { page: tabPage, per_page: 10 };
    const calls = {
      Rundown: () => eventService.listRundowns(id, { ...params, sort_by: 'urutan', order: 'asc' }),
      Vendor:  () => eventService.listVendors(id, params),
      Tugas:   () => eventService.listTugas(id, params),
      Laporan: () => eventService.listLaporan(id, params),
    };
    const call = calls[tab];
    if (!call) { setTabLoading(false); return; }
    call().then(res => {
      const d = res.data.data;
      if (tab === 'Rundown') setRundowns(d.rundowns || []);
      if (tab === 'Vendor')  setVendors(d.vendors   || []);
      if (tab === 'Tugas')   setTugas(d.tugas       || []);
      if (tab === 'Laporan') setLaporan(d.laporan   || []);
      setTabMeta(res.data.meta);
    }).catch(console.error).finally(() => setTabLoading(false));
  }, [tab, tabPage, event]);

  const handleTabChange = (t) => { setTab(t); setTabPage(1); };

  // Refresh current tab + stats
  const refreshTab = () => {
    if (!event) return;
    setTabLoading(true);
    const params = { page: tabPage, per_page: 10 };
    const calls = {
      Rundown: () => eventService.listRundowns(id, { ...params, sort_by: 'urutan', order: 'asc' }),
      Vendor:  () => eventService.listVendors(id, params),
      Tugas:   () => eventService.listTugas(id, params),
      Laporan: () => eventService.listLaporan(id, params),
    };
    const call = calls[tab];
    if (!call) { setTabLoading(false); return; }
    call().then(res => {
      const d = res.data.data;
      if (tab === 'Rundown') setRundowns(d.rundowns || []);
      if (tab === 'Vendor')  setVendors(d.vendors   || []);
      if (tab === 'Tugas')   setTugas(d.tugas       || []);
      if (tab === 'Laporan') setLaporan(d.laporan   || []);
      setTabMeta(res.data.meta);
    }).catch(console.error).finally(() => setTabLoading(false));
    eventService.getById(id).then(r => setStats(r.data.data.statistics)).catch(() => {});
  };

  // ─── Fix #4: Edit Event handlers ─────────────────────────
  const openEditEvent = () => {
    setEditEventForm({
      nama_event:      event.nama_event     || '',
      deskripsi:       event.deskripsi      || '',
      lokasi:          event.lokasi         || '',
      tanggal_mulai:   event.tanggal_mulai  || '',
      tanggal_selesai: event.tanggal_selesai || '',
      status:          event.status         || 'draft',
    });
    setEditEventModal(true);
  };

  const handleEditEventSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await eventService.update(id, editEventForm);
      const res = await eventService.getById(id);
      setEvent(res.data.data.event);
      setStats(res.data.data.statistics);
      toast('Event berhasil diupdate!', 'success');
      setEditEventModal(false);
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal update event', 'error');
    } finally { setSaving(false); }
  };

  const handleDeleteEvent = async () => {
    if (!confirm(`Hapus event "${event.nama_event}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeletingEvent(true);
    try {
      await eventService.delete(id);
      toast('Event berhasil dihapus', 'success');
      navigate('/events');
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal hapus event', 'error');
      setDeletingEvent(false);
    }
  };

  // ─── Vendor handlers ───────────────────────────────────────
  const openVendorCreate = () => {
    setVendorForm(VENDOR_INIT);
    setVendorModal({ open: true, data: null });
  };
  const openVendorEdit = (v) => {
    setVendorForm({
      nama_vendor: v.nama_vendor || '', kategori: v.kategori || '',
      kontak_person: v.kontak_person || '', telepon: v.telepon || '',
      email: v.email || '', alamat: v.alamat || '',
      status: v.status || 'aktif', catatan: v.catatan || '',
    });
    setVendorModal({ open: true, data: v });
  };
  const handleVendorSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (vendorModal.data) {
        await vendorService.update(vendorModal.data.id, vendorForm);
        toast('Vendor berhasil diupdate!', 'success');
      } else {
        await eventService.createVendor(id, vendorForm);
        toast('Vendor berhasil ditambahkan!', 'success');
      }
      setVendorModal({ open: false, data: null });
      refreshTab();
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal menyimpan vendor', 'error');
    } finally { setSaving(false); }
  };
  const handleVendorDelete = async (vendorId) => {
    if (!confirm('Hapus vendor ini?')) return;
    try {
      await vendorService.delete(vendorId);
      toast('Vendor berhasil dihapus', 'success');
      refreshTab();
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal hapus vendor', 'error');
    }
  };

  // ─── Rundown handlers ──────────────────────────────────────
  const openRundownCreate = () => {
    setRundownForm({ ...RUNDOWN_INIT, urutan: String(rundowns.length + 1) });
    setRundownModal({ open: true, data: null });
  };
  const openRundownEdit = (r) => {
    setRundownForm({
      urutan: String(r.urutan || ''), waktu_mulai: r.waktu_mulai || '',
      waktu_selesai: r.waktu_selesai || '', judul_sesi: r.judul_sesi || '',
      deskripsi: r.deskripsi || '', pic_id: r.pic_id ? String(r.pic_id) : '',
      vendor_id: r.vendor_id ? String(r.vendor_id) : '', status: r.status || 'belum',
    });
    setRundownModal({ open: true, data: r });
  };
  const handleRundownSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...rundownForm,
        urutan: parseInt(rundownForm.urutan),
        pic_id:    rundownForm.pic_id    ? parseInt(rundownForm.pic_id)    : null,
        vendor_id: rundownForm.vendor_id ? parseInt(rundownForm.vendor_id) : null,
        waktu_selesai: rundownForm.waktu_selesai || null,
        deskripsi: rundownForm.deskripsi || null,
      };
      if (rundownModal.data) {
        await rundownService.update(rundownModal.data.id, payload);
        toast('Rundown berhasil diupdate!', 'success');
      } else {
        await eventService.createRundown(id, payload);
        toast('Rundown berhasil ditambahkan!', 'success');
      }
      setRundownModal({ open: false, data: null });
      refreshTab();
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal menyimpan rundown', 'error');
    } finally { setSaving(false); }
  };
  const handleRundownDelete = async (rundownId) => {
    if (!confirm('Hapus sesi rundown ini?')) return;
    try {
      await rundownService.delete(rundownId);
      toast('Rundown berhasil dihapus', 'success');
      refreshTab();
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal hapus rundown', 'error');
    }
  };

  // ─── Tugas handlers ────────────────────────────────────────
  const openTugasCreate = () => {
    setTugasForm(TUGAS_INIT);
    setTugasModal({ open: true });
  };
  const handleTugasSave = async (e) => {
    e.preventDefault();
    if (!tugasForm.assignee_id) { toast('Pilih assignee terlebih dahulu', 'error'); return; }
    setSaving(true);
    try {
      const payload = {
        ...tugasForm,
        assignee_id: parseInt(tugasForm.assignee_id),
        rundown_id:  tugasForm.rundown_id ? parseInt(tugasForm.rundown_id) : null,
        deadline:    tugasForm.deadline   || null,
        deskripsi:   tugasForm.deskripsi  || null,
        divisi:      tugasForm.divisi     || null,
        catatan:     tugasForm.catatan    || null,
        lampiran_url: tugasForm.lampiran_url || null, // Fix #3
      };
      await eventService.createTugas(id, payload);
      toast('Tugas berhasil dibuat!', 'success');
      setTugasModal({ open: false });
      refreshTab();
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal membuat tugas', 'error');
    } finally { setSaving(false); }
  };
  const handleTugasDelete = async (tugasId) => {
    if (!confirm('Hapus tugas ini?')) return;
    try {
      await tugasService.delete(tugasId);
      toast('Tugas berhasil dihapus', 'success');
      refreshTab();
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal hapus tugas', 'error');
    }
  };
  const handleUpdateTugasStatus = async (tugasId, newStatus) => {
    try {
      await tugasService.updateStatus(tugasId, newStatus);
      const res = await eventService.listTugas(id, { page: tabPage, per_page: 10 });
      setTugas(res.data.data.tugas || []);
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal update status', 'error');
    }
  };

  // ─── Laporan handlers ──────────────────────────────────────
  const openLaporanCreate = () => {
    setLaporanForm(LAPORAN_INIT);
    setLaporanModal({ open: true });
  };
  const handleLaporanSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await eventService.createLaporan(id, laporanForm);
      toast('Laporan berhasil dibuat!', 'success');
      setLaporanModal({ open: false });
      refreshTab();
    } catch (err) {
      toast(err.response?.data?.message || 'Gagal membuat laporan', 'error');
    } finally { setSaving(false); }
  };

  if (loading) return <Spinner />;
  if (!event)  return null;

  // ─── Render ────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/events')}
          className="text-sm text-muted hover:text-text-base mb-4 flex items-center gap-1 transition-colors"
        >
          ← Kembali ke Events
        </button>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl font-display font-bold text-text-base">{event.nama_event}</h1>
              <Badge value={event.status} />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted flex-wrap">
              <span>📍 {event.lokasi || '-'}</span>
              <span>📅 {formatDate(event.tanggal_mulai)} — {formatDate(event.tanggal_selesai)}</span>
              <span>👤 {event.ketua?.name}</span>
            </div>
          </div>

          {/* Fix #4: Edit & Delete Event buttons */}
          {canManage && (
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={openEditEvent}
                className="btn-ghost btn-sm flex items-center gap-1.5"
              >
                ✏️ Edit Event
              </button>
              {isAdmin && (
                <button
                  onClick={handleDeleteEvent}
                  disabled={deletingEvent}
                  className="px-3 py-1.5 text-xs text-danger hover:bg-danger-bg rounded-lg border border-danger/20 transition-colors disabled:opacity-50"
                >
                  {deletingEvent ? 'Menghapus...' : '🗑️ Hapus Event'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stat pills */}
      {stats && (
        <div className="flex gap-3 flex-wrap">
          {[
            { label: 'Vendor',  value: stats.vendors  },
            { label: 'Rundown', value: stats.rundowns },
            { label: 'Tugas',   value: stats.tasks    },
          ].map(s => (
            <div key={s.label} className="bg-surface-2 rounded-xl px-4 py-2 flex items-center gap-2 border border-border-light">
              <span className="text-2xl font-display font-bold text-primary">{s.value}</span>
              <span className="text-sm text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Fix #1 & #2: Fitur Realtime — tombol akses langsung */}
      <div className="bg-surface-2 rounded-2xl border border-border-light p-4">
        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">⚡ Fitur Koordinasi Realtime</p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => navigate(`/chat/${id}`)}
            className="btn-ghost btn-sm flex items-center gap-1.5 border-accent/30 text-accent hover:bg-accent-bg"
          >
            💬 Chat Divisi
          </button>
          <button
            onClick={() => navigate(`/checklist/${id}`)}
            className="btn-ghost btn-sm flex items-center gap-1.5 border-success/30 text-success hover:bg-success-bg"
          >
            ✅ Checklist Realtime
          </button>
          {canManage && (
            <>
              <button
                onClick={() => navigate(`/rundown-changes/${id}`)}
                className="btn-ghost btn-sm flex items-center gap-1.5 border-secondary/30 text-secondary-dark hover:bg-secondary-bg"
              >
                🔄 Perubahan Rundown
              </button>
              <button
                onClick={() => navigate(`/koordinasi-log/${id}`)}
                className="btn-ghost btn-sm flex items-center gap-1.5 border-primary/30 text-primary hover:bg-primary-bg"
              >
                📋 Log Koordinasi
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                tab === t
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-text-base'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-48">
        {tabLoading ? <Spinner /> : (
          <>
            {/* ── Ringkasan ─────────────────────────────────── */}
            {tab === 'Ringkasan' && (
              <Card>
                <h3 className="font-display font-semibold mb-3 text-text-base">Deskripsi Event</h3>
                <p className="text-muted text-sm leading-relaxed">
                  {event.deskripsi || 'Tidak ada deskripsi.'}
                </p>
                {event.lokasi && (
                  <div className="mt-4 pt-4 border-t border-border-light">
                    <p className="text-xs text-muted mb-1">📍 Lokasi</p>
                    <p className="text-sm text-text-base">{event.lokasi}</p>
                  </div>
                )}
              </Card>
            )}

            {/* ── Rundown ───────────────────────────────────── */}
            {tab === 'Rundown' && (
              <div className="space-y-3">
                {canManage && (
                  <div className="flex justify-end">
                    <button onClick={openRundownCreate} className="btn-primary btn-sm">
                      + Tambah Rundown
                    </button>
                  </div>
                )}
                {rundowns.length === 0
                  ? <EmptyState icon="📋" title="Belum ada rundown" desc="Tambah sesi rundown untuk event ini." />
                  : rundowns.map(r => (
                    <Card key={r.id}>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                          {r.urutan}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-medium text-text-base">{r.judul_sesi}</span>
                            <Badge value={r.status} />
                          </div>
                          <div className="text-xs text-muted flex gap-4 flex-wrap">
                            <span>🕐 {r.waktu_mulai} — {r.waktu_selesai || '?'}</span>
                            {r.pic    && <span>👤 {r.pic.name}</span>}
                            {r.vendor && <span>🏢 {r.vendor.nama_vendor}</span>}
                          </div>
                          {r.deskripsi && (
                            <p className="text-xs text-muted mt-1 line-clamp-1">{r.deskripsi}</p>
                          )}
                        </div>
                        {canManage && (
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => openRundownEdit(r)}
                              className="text-xs text-accent hover:text-accent-dark px-2 py-1 rounded hover:bg-accent-bg transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleRundownDelete(r.id)}
                              className="text-xs text-danger hover:text-red-600 px-2 py-1 rounded hover:bg-danger-bg transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))
                }
                <Pagination meta={tabMeta} onPageChange={setTabPage} />
              </div>
            )}

            {/* ── Vendor ────────────────────────────────────── */}
            {tab === 'Vendor' && (
              <div className="space-y-3">
                {canManage && (
                  <div className="flex justify-end">
                    <button onClick={openVendorCreate} className="btn-primary btn-sm">
                      + Tambah Vendor
                    </button>
                  </div>
                )}
                {vendors.length === 0
                  ? <EmptyState icon="🏢" title="Belum ada vendor" desc="Tambah vendor yang terlibat dalam event ini." />
                  : vendors.map(v => (
                    <Card key={v.id}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-medium text-text-base">{v.nama_vendor}</span>
                            {v.kategori && (
                              <span className="text-xs text-muted bg-white/5 px-2 py-0.5 rounded">
                                {v.kategori}
                              </span>
                            )}
                            <Badge value={v.status} />
                          </div>
                          <div className="text-xs text-muted flex gap-4 flex-wrap">
                            {v.kontak_person && <span>👤 {v.kontak_person}</span>}
                            {v.telepon       && <span>📞 {v.telepon}</span>}
                            {v.email         && <span>✉️ {v.email}</span>}
                          </div>
                          {v.catatan && (
                            <p className="text-xs text-muted mt-1 line-clamp-1">📝 {v.catatan}</p>
                          )}
                          {/* Fix #3: tampilkan link kontrak jika ada */}
                          {v.kontrak_url && (
                            <a href={v.kontrak_url} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline mt-1 flex items-center gap-1">
                              📎 Lihat Kontrak
                            </a>
                          )}
                        </div>
                        {canManage && (
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => openVendorEdit(v)}
                              className="text-xs text-accent hover:text-accent-dark px-2 py-1 rounded hover:bg-accent-bg transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleVendorDelete(v.id)}
                              className="text-xs text-danger hover:text-red-600 px-2 py-1 rounded hover:bg-danger-bg transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))
                }
                <Pagination meta={tabMeta} onPageChange={setTabPage} />
              </div>
            )}

            {/* ── Tugas ─────────────────────────────────────── */}
            {tab === 'Tugas' && (
              <div className="space-y-3">
                {canManage && (
                  <div className="flex justify-end">
                    <button onClick={openTugasCreate} className="btn-primary btn-sm">
                      + Buat Tugas
                    </button>
                  </div>
                )}
                {tugas.length === 0
                  ? <EmptyState icon="✅" title="Belum ada tugas" desc="Buat dan alokasikan tugas ke staf." />
                  : tugas.map(t => (
                    <Card key={t.id}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-medium text-text-base">{t.judul}</span>
                            <Badge value={t.status} />
                            <Badge value={t.prioritas} />
                          </div>
                          <div className="text-xs text-muted flex gap-4 flex-wrap">
                            {t.assignee && <span>👤 {t.assignee.name}</span>}
                            {t.divisi   && <span>🏷️ {t.divisi}</span>}
                            {t.deadline && <span>⏰ {formatDateTime(t.deadline)}</span>}
                          </div>
                          {t.deskripsi && (
                            <p className="text-xs text-muted mt-1 line-clamp-1">{t.deskripsi}</p>
                          )}
                          {/* Fix #3: tampilkan link lampiran jika ada */}
                          {t.lampiran_url && (
                            <a href={t.lampiran_url} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline mt-1 flex items-center gap-1">
                              📎 Lampiran
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Fix #5: admin & ketua juga bisa update status tugas mereka */}
                          {(isAdmin || user?.role === 'ketua' || user?.id === t.assignee_id) && (
                            <select
                              value={t.status}
                              onChange={e => handleUpdateTugasStatus(t.id, e.target.value)}
                              className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-text-base focus:outline-none"
                            >
                              {['belum', 'proses', 'selesai', 'terkendala'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          )}
                          {canManage && (
                            <button
                              onClick={() => handleTugasDelete(t.id)}
                              className="text-xs text-danger hover:text-red-600 px-2 py-1 rounded hover:bg-danger-bg transition-colors"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))
                }
                <Pagination meta={tabMeta} onPageChange={setTabPage} />
              </div>
            )}

            {/* ── Laporan ───────────────────────────────────── */}
            {tab === 'Laporan' && (
              <div className="space-y-3">
                {canManage && (
                  <div className="flex justify-end">
                    <button onClick={openLaporanCreate} className="btn-primary btn-sm">
                      + Buat Laporan
                    </button>
                  </div>
                )}
                {laporan.length === 0
                  ? <EmptyState icon="📄" title="Belum ada laporan" desc="Buat laporan pelaksanaan event." />
                  : laporan.map(l => (
                    <Card key={l.id}>
                      <h3 className="font-medium text-text-base mb-1">{l.judul}</h3>
                      <p className="text-sm text-muted line-clamp-2 mb-2">{l.konten}</p>
                      <div className="text-xs text-muted flex gap-4 flex-wrap">
                        <span>👤 {l.ketua?.name}</span>
                        <span>📅 {formatDate(l.tanggal)}</span>
                      </div>
                      {/* Fix #3: tampilkan link file laporan jika ada */}
                      {l.file_url && (
                        <a href={l.file_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline mt-2 flex items-center gap-1">
                          📎 Lihat File Laporan
                        </a>
                      )}
                    </Card>
                  ))
                }
                <Pagination meta={tabMeta} onPageChange={setTabPage} />
              </div>
            )}
          </>
        )}
      </div>

      {/* ═══════ MODALS ═══════════════════════════════════════ */}

      {/* Fix #4: Edit Event Modal */}
      <Modal
        open={editEventModal}
        onClose={() => setEditEventModal(false)}
        title="Edit Event"
        size="md"
      >
        <form onSubmit={handleEditEventSave} className="space-y-4">
          <div>
            <label className="label">Nama Event *</label>
            <input
              value={editEventForm.nama_event} required className="input"
              onChange={e => setEditEventForm(p => ({ ...p, nama_event: e.target.value }))}
              placeholder="Nama event"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Tanggal Mulai *</label>
              <input type="date"
                value={editEventForm.tanggal_mulai} required className="input"
                onChange={e => setEditEventForm(p => ({ ...p, tanggal_mulai: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Tanggal Selesai *</label>
              <input type="date"
                value={editEventForm.tanggal_selesai} required className="input"
                onChange={e => setEditEventForm(p => ({ ...p, tanggal_selesai: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="label">Lokasi</label>
            <input
              value={editEventForm.lokasi} className="input"
              onChange={e => setEditEventForm(p => ({ ...p, lokasi: e.target.value }))}
              placeholder="Gedung / Kota"
            />
          </div>
          <div>
            <label className="label">Status</label>
            <select
              value={editEventForm.status} className="input"
              onChange={e => setEditEventForm(p => ({ ...p, status: e.target.value }))}
            >
              {['draft','aktif','selesai','batal'].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Deskripsi</label>
            <textarea
              value={editEventForm.deskripsi} rows={3} className="input resize-none"
              onChange={e => setEditEventForm(p => ({ ...p, deskripsi: e.target.value }))}
              placeholder="Deskripsi singkat event..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setEditEventModal(false)} className="btn-ghost flex-1">Batal</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Vendor Modal */}
      <Modal
        open={vendorModal.open}
        onClose={() => setVendorModal({ open: false, data: null })}
        title={vendorModal.data ? 'Edit Vendor' : 'Tambah Vendor'}
        size="md"
      >
        <form onSubmit={handleVendorSave} className="space-y-3">
          <div>
            <label className="label">Nama Vendor *</label>
            <input
              value={vendorForm.nama_vendor} required className="input"
              onChange={e => setVendorForm(p => ({ ...p, nama_vendor: e.target.value }))}
              placeholder="Nama vendor"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Kategori</label>
              <input
                value={vendorForm.kategori} className="input"
                onChange={e => setVendorForm(p => ({ ...p, kategori: e.target.value }))}
                placeholder="catering, sound, dll"
              />
            </div>
            <div>
              <label className="label">Status</label>
              <select
                value={vendorForm.status} className="input"
                onChange={e => setVendorForm(p => ({ ...p, status: e.target.value }))}
              >
                {['aktif', 'selesai', 'batal'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Kontak Person</label>
              <input
                value={vendorForm.kontak_person} className="input"
                onChange={e => setVendorForm(p => ({ ...p, kontak_person: e.target.value }))}
                placeholder="Nama PIC"
              />
            </div>
            <div>
              <label className="label">Telepon</label>
              <input
                value={vendorForm.telepon} className="input"
                onChange={e => setVendorForm(p => ({ ...p, telepon: e.target.value }))}
                placeholder="08xxx"
              />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="email" value={vendorForm.email} className="input"
              onChange={e => setVendorForm(p => ({ ...p, email: e.target.value }))}
              placeholder="vendor@email.com"
            />
          </div>
          <div>
            <label className="label">Alamat</label>
            <input
              value={vendorForm.alamat} className="input"
              onChange={e => setVendorForm(p => ({ ...p, alamat: e.target.value }))}
              placeholder="Alamat lengkap"
            />
          </div>
          {/* Fix #3: File Upload untuk kontrak vendor */}
          <div>
            <label className="label">File Kontrak</label>
            <FileUploadInput
              value={vendorForm.kontrak_url || ''}
              onChange={url => setVendorForm(p => ({ ...p, kontrak_url: url }))}
              folder="kontrak"
              accept=".pdf,.docx,.xlsx"
            />
          </div>
          <div>
            <label className="label">Catatan</label>
            <textarea
              value={vendorForm.catatan} rows={2} className="input resize-none"
              onChange={e => setVendorForm(p => ({ ...p, catatan: e.target.value }))}
              placeholder="Catatan tambahan..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setVendorModal({ open: false, data: null })} className="btn-ghost flex-1">Batal</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Rundown Modal */}
      <Modal
        open={rundownModal.open}
        onClose={() => setRundownModal({ open: false, data: null })}
        title={rundownModal.data ? 'Edit Rundown' : 'Tambah Rundown'}
        size="md"
      >
        <form onSubmit={handleRundownSave} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Urutan *</label>
              <input
                type="number" min="1" value={rundownForm.urutan} required className="input"
                onChange={e => setRundownForm(p => ({ ...p, urutan: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Status</label>
              <select
                value={rundownForm.status} className="input"
                onChange={e => setRundownForm(p => ({ ...p, status: e.target.value }))}
              >
                {['belum', 'berjalan', 'selesai', 'ditunda'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Waktu Mulai *</label>
              <input
                type="time" value={rundownForm.waktu_mulai} required className="input"
                onChange={e => setRundownForm(p => ({ ...p, waktu_mulai: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Waktu Selesai</label>
              <input
                type="time" value={rundownForm.waktu_selesai} className="input"
                onChange={e => setRundownForm(p => ({ ...p, waktu_selesai: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="label">Judul Sesi *</label>
            <input
              value={rundownForm.judul_sesi} required className="input"
              onChange={e => setRundownForm(p => ({ ...p, judul_sesi: e.target.value }))}
              placeholder="Nama sesi"
            />
          </div>
          <div>
            <label className="label">Deskripsi</label>
            <textarea
              value={rundownForm.deskripsi} rows={2} className="input resize-none"
              onChange={e => setRundownForm(p => ({ ...p, deskripsi: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">PIC (Penanggung Jawab)</label>
              <select
                value={rundownForm.pic_id} className="input"
                onChange={e => setRundownForm(p => ({ ...p, pic_id: e.target.value }))}
              >
                <option value="">— Pilih PIC —</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Vendor</label>
              <select
                value={rundownForm.vendor_id} className="input"
                onChange={e => setRundownForm(p => ({ ...p, vendor_id: e.target.value }))}
              >
                <option value="">— Pilih Vendor —</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>{v.nama_vendor}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setRundownModal({ open: false, data: null })} className="btn-ghost flex-1">Batal</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Tugas Modal */}
      <Modal
        open={tugasModal.open}
        onClose={() => setTugasModal({ open: false })}
        title="Buat Tugas"
        size="md"
      >
        <form onSubmit={handleTugasSave} className="space-y-3">
          <div>
            <label className="label">Judul Tugas *</label>
            <input
              value={tugasForm.judul} required className="input"
              onChange={e => setTugasForm(p => ({ ...p, judul: e.target.value }))}
              placeholder="Nama tugas"
            />
          </div>
          <div>
            <label className="label">Assignee (Penanggung Jawab) *</label>
            <select
              value={tugasForm.assignee_id} required className="input"
              onChange={e => setTugasForm(p => ({ ...p, assignee_id: e.target.value }))}
            >
              <option value="">— Pilih User —</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Prioritas</label>
              <select
                value={tugasForm.prioritas} className="input"
                onChange={e => setTugasForm(p => ({ ...p, prioritas: e.target.value }))}
              >
                {['rendah', 'sedang', 'tinggi', 'kritis'].map(p => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Divisi</label>
              <input
                value={tugasForm.divisi} className="input"
                onChange={e => setTugasForm(p => ({ ...p, divisi: e.target.value }))}
                placeholder="Divisi"
              />
            </div>
          </div>
          <div>
            <label className="label">Deadline</label>
            <input
              type="datetime-local" value={tugasForm.deadline} className="input"
              onChange={e => setTugasForm(p => ({ ...p, deadline: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Deskripsi</label>
            <textarea
              value={tugasForm.deskripsi} rows={2} className="input resize-none"
              onChange={e => setTugasForm(p => ({ ...p, deskripsi: e.target.value }))}
              placeholder="Deskripsi tugas..."
            />
          </div>
          <div>
            <label className="label">Catatan</label>
            <input
              value={tugasForm.catatan} className="input"
              onChange={e => setTugasForm(p => ({ ...p, catatan: e.target.value }))}
              placeholder="Catatan tambahan"
            />
          </div>
          {/* Fix #3: File Upload untuk lampiran tugas */}
          <div>
            <label className="label">Lampiran Tugas</label>
            <FileUploadInput
              value={tugasForm.lampiran_url}
              onChange={url => setTugasForm(p => ({ ...p, lampiran_url: url }))}
              folder="lampiran_tugas"
              accept=".jpg,.jpeg,.png,.pdf,.docx,.xlsx"
            />
          </div>
          <div>
            <label className="label">Terkait Rundown (opsional)</label>
            <select
              value={tugasForm.rundown_id} className="input"
              onChange={e => setTugasForm(p => ({ ...p, rundown_id: e.target.value }))}
            >
              <option value="">— Tidak terkait rundown —</option>
              {rundowns.map(r => (
                <option key={r.id} value={r.id}>{r.urutan}. {r.judul_sesi}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setTugasModal({ open: false })} className="btn-ghost flex-1">Batal</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Menyimpan...' : 'Buat Tugas'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Laporan Modal */}
      <Modal
        open={laporanModal.open}
        onClose={() => setLaporanModal({ open: false })}
        title="Buat Laporan"
        size="md"
      >
        <form onSubmit={handleLaporanSave} className="space-y-3">
          <div>
            <label className="label">Judul Laporan *</label>
            <input
              value={laporanForm.judul} required className="input"
              onChange={e => setLaporanForm(p => ({ ...p, judul: e.target.value }))}
              placeholder="Judul laporan"
            />
          </div>
          <div>
            <label className="label">Tanggal</label>
            <input
              type="date" value={laporanForm.tanggal} className="input"
              onChange={e => setLaporanForm(p => ({ ...p, tanggal: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Konten Laporan *</label>
            <textarea
              value={laporanForm.konten} required rows={6} className="input resize-none"
              onChange={e => setLaporanForm(p => ({ ...p, konten: e.target.value }))}
              placeholder="Tuliskan isi laporan pelaksanaan event..."
            />
          </div>
          {/* Fix #3: File Upload untuk laporan */}
          <div>
            <label className="label">File Laporan (PDF/Dokumen)</label>
            <FileUploadInput
              value={laporanForm.file_url}
              onChange={url => setLaporanForm(p => ({ ...p, file_url: url }))}
              folder="laporan"
              accept=".pdf,.docx,.xlsx"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setLaporanModal({ open: false })} className="btn-ghost flex-1">Batal</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Menyimpan...' : 'Buat Laporan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}