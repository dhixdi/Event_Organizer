import api from './api';

export const userService = {
  list:       (params)   => api.get('/users', { params }),
  getById:    (id)       => api.get(`/users/${id}`),
  update:     (id, data) => api.put(`/users/${id}`, data),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  delete:     (id)       => api.delete(`/users/${id}`),
};