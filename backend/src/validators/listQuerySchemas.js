const { Joi } = require('./commonSchemas');

const baseListQuery = {
  page: Joi.number().integer().positive(),
  per_page: Joi.number().integer().positive().max(100),
  order: Joi.string().valid('asc', 'desc').insensitive(),
};

const userListQuerySchema = Joi.object({
  ...baseListQuery,
  q: Joi.string().max(100),
  role: Joi.string().valid('admin', 'ketua', 'staf'),
  divisi: Joi.string().max(50),
  is_active: Joi.boolean(),
  sort_by: Joi.string().valid('created_at', 'name', 'email', 'role'),
});

const eventListQuerySchema = Joi.object({
  ...baseListQuery,
  q: Joi.string().max(150),
  status: Joi.string().valid('draft', 'aktif', 'selesai', 'batal'),
  ketua_id: Joi.number().integer().positive(),
  tanggal_mulai_from: Joi.date(),
  tanggal_mulai_to: Joi.date(),
  sort_by: Joi.string().valid('created_at', 'tanggal_mulai', 'tanggal_selesai', 'nama_event'),
});

const vendorListQuerySchema = Joi.object({
  ...baseListQuery,
  q: Joi.string().max(100),
  status: Joi.string().valid('aktif', 'selesai', 'batal'),
  kategori: Joi.string().max(50),
  sort_by: Joi.string().valid('created_at', 'nama_vendor', 'status'),
});

const rundownListQuerySchema = Joi.object({
  ...baseListQuery,
  q: Joi.string().max(150),
  status: Joi.string().valid('belum', 'berjalan', 'selesai', 'ditunda'),
  pic_id: Joi.number().integer().positive(),
  vendor_id: Joi.number().integer().positive(),
  sort_by: Joi.string().valid('urutan', 'created_at', 'waktu_mulai', 'judul_sesi'),
});

const tugasListQuerySchema = Joi.object({
  ...baseListQuery,
  q: Joi.string().max(150),
  status: Joi.string().valid('belum', 'proses', 'selesai', 'terkendala'),
  prioritas: Joi.string().valid('rendah', 'sedang', 'tinggi', 'kritis'),
  assignee_id: Joi.number().integer().positive(),
  divisi: Joi.string().max(50),
  sort_by: Joi.string().valid('created_at', 'deadline', 'prioritas', 'status', 'judul'),
});

const laporanListQuerySchema = Joi.object({
  ...baseListQuery,
  q: Joi.string().max(150),
  ketua_id: Joi.number().integer().positive(),
  tanggal_from: Joi.date(),
  tanggal_to: Joi.date(),
  sort_by: Joi.string().valid('created_at', 'tanggal', 'judul'),
});

module.exports = {
  userListQuerySchema,
  eventListQuerySchema,
  vendorListQuerySchema,
  rundownListQuerySchema,
  tugasListQuerySchema,
  laporanListQuerySchema,
};
