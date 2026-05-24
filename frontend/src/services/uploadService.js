import api from './api';

export const uploadService = {
  upload: (file, resourceType = null, resourceId = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (resourceType) formData.append('resource_type', resourceType);
    if (resourceId)   formData.append('resource_id', String(resourceId));
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};