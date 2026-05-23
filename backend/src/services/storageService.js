const path = require('path');
const { Storage } = require('@google-cloud/storage');

let storageClient;

function getStorageClient() {
  if (!storageClient) {
    storageClient = new Storage({
      projectId: process.env.GCS_PROJECT_ID || undefined,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS || undefined,
    });
  }

  return storageClient;
}

function sanitizeFolder(folder = '') {
  return String(folder)
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
    .replace(/\.\./g, '');
}

function sanitizeFilename(filename = 'file') {
  const ext = path.extname(filename).toLowerCase();
  const base = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
  return `${base || 'file'}${ext}`;
}

function buildPublicUrl(bucketName, objectPath) {
  const encodedPath = objectPath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `https://storage.googleapis.com/${bucketName}/${encodedPath}`;
}

function ensureGcsConfigured() {
  if (!process.env.GCS_BUCKET_NAME) {
    const error = new Error('GCS_BUCKET_NAME belum dikonfigurasi');
    error.statusCode = 500;
    throw error;
  }
}

async function uploadFile(file, options = {}) {
  ensureGcsConfigured();

  if (!file || !file.buffer) {
    const error = new Error('File upload tidak valid');
    error.statusCode = 400;
    throw error;
  }

  const bucketName = process.env.GCS_BUCKET_NAME;
  const folder = sanitizeFolder(options.folder || process.env.GCS_UPLOAD_FOLDER || 'misc');
  const timestamp = Date.now();
  const filename = sanitizeFilename(file.originalname);
  const objectPath = folder ? `${folder}/${timestamp}-${filename}` : `${timestamp}-${filename}`;

  const bucket = getStorageClient().bucket(bucketName);
  const blob = bucket.file(objectPath);

  await new Promise((resolve, reject) => {
    const stream = blob.createWriteStream({
      resumable: false,
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on('error', reject);
    stream.on('finish', resolve);
    stream.end(file.buffer);
  });

  const makePublic = process.env.GCS_MAKE_PUBLIC === 'true';
  if (makePublic) {
    await blob.makePublic();
  }

  return {
    bucket: bucketName,
    object_path: objectPath,
    filename: path.basename(objectPath),
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: buildPublicUrl(bucketName, objectPath),
    gcs_uri: `gs://${bucketName}/${objectPath}`,
    is_public: makePublic,
  };
}

module.exports = { uploadFile };