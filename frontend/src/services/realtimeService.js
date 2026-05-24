import api from './api';

export const realtimeService = {
  // Checklist
  createChecklist:      (data)        => api.post('/realtime/checklist', data),
  listChecklist:        (eventId)     => api.get(`/realtime/events/${eventId}/checklist`),
  updateChecklistStatus:(id, data)    => api.patch(`/realtime/checklist/${id}/status`, data),

  // Chat
  sendMessage:          (data)        => api.post('/realtime/chat/messages', data),
  listChat:             (eventId, params) => api.get(`/realtime/events/${eventId}/chat`, { params }),

  // Notifikasi
  listMyNotifications:  (params)      => api.get('/realtime/notifikasi/me', { params }),
  markNotifRead:        (id)          => api.patch(`/realtime/notifikasi/${id}/read`),
  createNotifikasi:     (data)        => api.post('/realtime/notifikasi', data),

  // Rundown changes
  createRundownChange:  (data)        => api.post('/realtime/rundown-changes', data),
  listRundownChanges:   (eventId)     => api.get(`/realtime/events/${eventId}/rundown-changes`),

  // Logs
  createLog:            (data)        => api.post('/realtime/logs', data),
  listLogs:             (eventId)     => api.get(`/realtime/events/${eventId}/logs`),
};