import api from './api';

export const realtimeService = {
  // ─── Notifications ───────────────────────────
  getMyNotifications: (params) =>
    api.get('/realtime/notifikasi/me', { params }),
  markNotifRead: (id) =>
    api.patch(`/realtime/notifikasi/${id}/read`),
  createNotification: (data) =>
    api.post('/realtime/notifikasi', data),

  // ─── Chat ─────────────────────────────────────
  getChatByEvent: (eventId, params) =>
    api.get(`/realtime/events/${eventId}/chat`, { params }),
  sendMessage: (data) =>
    api.post('/realtime/chat/messages', data),

  // ─── Checklist ─────────────────────────────────
  getChecklistByEvent: (eventId) =>
    api.get(`/realtime/events/${eventId}/checklist`),
  createChecklist: (data) =>
    api.post('/realtime/checklist', data),
  updateChecklistStatus: (id, data) =>
    api.patch(`/realtime/checklist/${id}/status`, data),

  // ─── Rundown Changes ───────────────────────────
  getRundownChanges: (eventId) =>
    api.get(`/realtime/events/${eventId}/rundown-changes`),
  createRundownChange: (data) =>
    api.post('/realtime/rundown-changes', data),

  // ─── Logs ─────────────────────────────────────
  getLogsByEvent: (eventId) =>
    api.get(`/realtime/events/${eventId}/logs`),
  createLog: (data) =>
    api.post('/realtime/logs', data),
};