'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('events', [
      {
        id: 1,
        nama_event: 'Workshop Tech Innovation 2026',
        deskripsi: 'Workshop tentang inovasi teknologi terkini',
        lokasi: 'Gedung Serbaguna - Lantai 2',
        tanggal_mulai: '2026-05-20',
        tanggal_selesai: '2026-05-22',
        status: 'aktif',
        ketua_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        nama_event: 'Gathering Perusahaan 2026',
        deskripsi: 'Gathering tahunan karyawan dan keluarga',
        lokasi: 'Resort Alam Mandi - Bogor',
        tanggal_mulai: '2026-06-10',
        tanggal_selesai: '2026-06-12',
        status: 'draft',
        ketua_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('events', null, {});
  },
};
