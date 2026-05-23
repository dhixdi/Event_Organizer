const path = require('path');
const multer = require('multer');
const { errorResponse } = require('../utils/response');

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.pdf', '.docx', '.xlsx']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const isAllowedMimeType = allowedMimeTypes.has(file.mimetype);
    const isAllowedExtension = allowedExtensions.has(ext);

    if (!isAllowedMimeType || !isAllowedExtension) {
      return cb(new Error('Tipe file tidak diizinkan. Gunakan jpg, jpeg, png, pdf, docx, atau xlsx.'));
    }

    return cb(null, true);
  },
});

function uploadSingle(req, res, next) {
  upload.single('file')(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, {
        message: 'Ukuran file maksimal 10 MB',
        statusCode: 400,
      });
    }

    return errorResponse(res, {
      message: error.message || 'Gagal memproses file upload',
      statusCode: 400,
    });
  });
}

module.exports = { uploadSingle };
