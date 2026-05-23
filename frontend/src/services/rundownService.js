import api from './api';

export const rundownService = {
  update: (id, data) => api.put(`/rundowns/${id}`, data),
  delete: (id)       => api.delete(`/rundowns/${id}`),
};