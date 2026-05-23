const { Joi } = require('./commonSchemas');

const rundownCreateSchema = Joi.object({
  urutan: Joi.number().integer().positive().required(),
  waktu_mulai: Joi.string().required(),
  waktu_selesai: Joi.string().allow(null, ''),
  judul_sesi: Joi.string().max(150).required(),
  deskripsi: Joi.string().allow(null, ''),
  pic_id: Joi.number().integer().positive().allow(null),
  vendor_id: Joi.number().integer().positive().allow(null),
  status: Joi.string().valid('belum', 'berjalan', 'selesai', 'ditunda').default('belum'),
});

const rundownUpdateSchema = Joi.object({
  urutan: Joi.number().integer().positive(),
  waktu_mulai: Joi.string(),
  waktu_selesai: Joi.string().allow(null, ''),
  judul_sesi: Joi.string().max(150),
  deskripsi: Joi.string().allow(null, ''),
  pic_id: Joi.number().integer().positive().allow(null),
  vendor_id: Joi.number().integer().positive().allow(null),
  status: Joi.string().valid('belum', 'berjalan', 'selesai', 'ditunda'),
}).min(1);

module.exports = {
  rundownCreateSchema,
  rundownUpdateSchema,
};
