const { Joi } = require('./commonSchemas');

const vendorCreateSchema = Joi.object({
  nama_vendor: Joi.string().max(100).required(),
  kategori: Joi.string().max(50).allow(null, ''),
  kontak_person: Joi.string().max(100).allow(null, ''),
  telepon: Joi.string().max(20).allow(null, ''),
  email: Joi.string().email().allow(null, ''),
  alamat: Joi.string().allow(null, ''),
  kontrak_url: Joi.string().uri().allow(null, ''),
  status: Joi.string().valid('aktif', 'selesai', 'batal').default('aktif'),
  catatan: Joi.string().allow(null, ''),
});

const vendorUpdateSchema = Joi.object({
  nama_vendor: Joi.string().max(100),
  kategori: Joi.string().max(50).allow(null, ''),
  kontak_person: Joi.string().max(100).allow(null, ''),
  telepon: Joi.string().max(20).allow(null, ''),
  email: Joi.string().email().allow(null, ''),
  alamat: Joi.string().allow(null, ''),
  kontrak_url: Joi.string().uri().allow(null, ''),
  status: Joi.string().valid('aktif', 'selesai', 'batal'),
  catatan: Joi.string().allow(null, ''),
}).min(1);

module.exports = {
  vendorCreateSchema,
  vendorUpdateSchema,
};
