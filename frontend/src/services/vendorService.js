import api from './api';

export const vendorService = {
  getById: (id)       => api.get(`/vendors/${id}`),
  update:  (id, data) => api.put(`/vendors/${id}`, data),
  delete:  (id)       => api.delete(`/vendors/${id}`),
};