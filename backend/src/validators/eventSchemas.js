const { Joi } = require('./commonSchemas');

const eventCreateSchema = Joi.object({
  nama_event: Joi.string().max(150).required(),
  deskripsi: Joi.string().allow(null, ''),
  lokasi: Joi.string().max(200).allow(null, ''),
  tanggal_mulai: Joi.date().required(),
  tanggal_selesai: Joi.date().required(),
  status: Joi.string().valid('draft', 'aktif', 'selesai', 'batal').default('draft'),
  ketua_id: Joi.number().integer().positive(),
});

const eventUpdateSchema = Joi.object({
  nama_event: Joi.string().max(150),
  deskripsi: Joi.string().allow(null, ''),
  lokasi: Joi.string().max(200).allow(null, ''),
  tanggal_mulai: Joi.date(),
  tanggal_selesai: Joi.date(),
  status: Joi.string().valid('draft', 'aktif', 'selesai', 'batal'),
}).min(1);

module.exports = {
  eventCreateSchema,
  eventUpdateSchema,
};
