import api from './api';

export const uploadService = {
  uploadFile: (file, folder = 'misc', resourceId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    if (resourceId) formData.append('resource_id', resourceId);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};