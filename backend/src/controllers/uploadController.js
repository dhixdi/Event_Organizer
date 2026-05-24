const { successResponse, errorResponse } = require('../utils/response');
const storageService = require('../services/storageService');

const FOLDER_MAP = {
  avatar: 'avatars',
  kontrak: 'kontrak',
  lampiran_tugas: 'lampiran-tugas',
  laporan: 'laporan',
  chat_file: 'chat-files',
};

function resolveUploadFolder(body = {}) {
  if (body.folder) {
    return String(body.folder).replace(/^\/+|\/+$/g, '');
  }

  const resourceType = body.resource_type ? String(body.resource_type) : null;
  const resourceId = body.resource_id ? String(body.resource_id) : null;
  const baseFolder = resourceType && FOLDER_MAP[resourceType] ? FOLDER_MAP[resourceType] : 'misc';

  if (!resourceId) {
    return baseFolder;
  }

  return `${baseFolder}/${resourceId}`;
}

async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return errorResponse(res, { message: 'File wajib diupload', statusCode: 400 });
    }

    const folder = resolveUploadFolder(req.body);
    const uploadedFile = await storageService.uploadFile(req.file, { folder });

    return successResponse(res, {
      message: 'File berhasil diupload',
      data: {
        file: uploadedFile,
      },
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { uploadFile };