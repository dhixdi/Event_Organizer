import api from './api';

export const eventService = {
  list:       (params) => api.get('/events', { params }),
  getById:    (id)     => api.get(`/events/${id}`),
  create:     (data)   => api.post('/events', data),
  update:     (id, data) => api.put(`/events/${id}`, data),
  delete:     (id)     => api.delete(`/events/${id}`),

  // Nested resources
  listVendors:   (id, params) => api.get(`/events/${id}/vendors`, { params }),
  createVendor:  (id, data)   => api.post(`/events/${id}/vendors`, data),
  listRundowns:  (id, params) => api.get(`/events/${id}/rundowns`, { params }),
  createRundown: (id, data)   => api.post(`/events/${id}/rundowns`, data),
  listTugas:     (id, params) => api.get(`/events/${id}/tugas`, { params }),
  createTugas:   (id, data)   => api.post(`/events/${id}/tugas`, data),
  listLaporan:   (id, params) => api.get(`/events/${id}/laporan`, { params }),
  createLaporan: (id, data)   => api.post(`/events/${id}/laporan`, data),
};