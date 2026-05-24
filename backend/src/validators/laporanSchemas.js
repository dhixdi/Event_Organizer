const { Joi } = require('./commonSchemas');

const laporanCreateSchema = Joi.object({
  judul: Joi.string().max(150).required(),
  konten: Joi.string().required(),
  file_url: Joi.string().uri().allow(null, ''),
  tanggal: Joi.date(),
});

module.exports = {
  laporanCreateSchema,
};
