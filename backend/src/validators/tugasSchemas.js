const { Joi } = require('./commonSchemas');

const tugasCreateSchema = Joi.object({
  judul: Joi.string().max(150).required(),
  deskripsi: Joi.string().allow(null, ''),
  assignee_id: Joi.number().integer().positive().required(),
  divisi: Joi.string().max(50).allow(null, ''),
  prioritas: Joi.string().valid('rendah', 'sedang', 'tinggi', 'kritis').default('sedang'),
  status: Joi.string().valid('belum', 'proses', 'selesai', 'terkendala').default('belum'),
  deadline: Joi.date().allow(null),
  lampiran_url: Joi.string().uri().allow(null, ''),
  catatan: Joi.string().allow(null, ''),
  rundown_id: Joi.number().integer().positive().allow(null),
});

const tugasUpdateSchema = Joi.object({
  judul: Joi.string().max(150),
  deskripsi: Joi.string().allow(null, ''),
  assignee_id: Joi.number().integer().positive(),
  divisi: Joi.string().max(50).allow(null, ''),
  prioritas: Joi.string().valid('rendah', 'sedang', 'tinggi', 'kritis'),
  status: Joi.string().valid('belum', 'proses', 'selesai', 'terkendala'),
  deadline: Joi.date().allow(null),
  lampiran_url: Joi.string().uri().allow(null, ''),
  catatan: Joi.string().allow(null, ''),
  rundown_id: Joi.number().integer().positive().allow(null),
}).min(1);

const tugasStatusUpdateSchema = Joi.object({
  status: Joi.string().valid('belum', 'proses', 'selesai', 'terkendala').required(),
  catatan: Joi.string().allow(null, ''),
});

module.exports = {
  tugasCreateSchema,
  tugasUpdateSchema,
  tugasStatusUpdateSchema,
};
