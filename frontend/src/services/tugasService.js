import api from './api';

export const tugasService = {
  list:         (params)             => api.get('/tugas', { params }),       // ← BARU
  getById:      (id)                 => api.get(`/tugas/${id}`),
  update:       (id, data)           => api.put(`/tugas/${id}`, data),
  updateStatus: (id, status, catatan) =>
    api.patch(`/tugas/${id}/status`, { status, catatan }),
  delete:       (id)                 => api.delete(`/tugas/${id}`),
};