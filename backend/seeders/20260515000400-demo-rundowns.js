'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('rundowns', [
      {
        id: 1,
        event_id: 1,
        urutan: 1,
        waktu_mulai: '08:00:00',
        waktu_selesai: '08:30:00',
        judul_sesi: 'Registrasi & Pembukaan',
        deskripsi: 'Peserta registrasi dan pembukaan acara',
        pic_id: 2,
        status: 'belum',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        event_id: 1,
        urutan: 2,
        waktu_mulai: '08:30:00',
        waktu_selesai: '10:00:00',
        judul_sesi: 'Keynote - Future of AI',
        deskripsi: 'Pembicara utama tentang masa depan AI',
        pic_id: 2,
        vendor_id: 3,
        status: 'belum',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        event_id: 1,
        urutan: 3,
        waktu_mulai: '10:00:00',
        waktu_selesai: '10:30:00',
        judul_sesi: 'Coffee Break',
        deskripsi: 'Istirahat dan networking',
        vendor_id: 1,
        status: 'belum',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        event_id: 1,
        urutan: 4,
        waktu_mulai: '10:30:00',
        waktu_selesai: '12:00:00',
        judul_sesi: 'Workshop Session 1',
        deskripsi: 'Sesi workshop pilihan 1',
        status: 'belum',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        event_id: 1,
        urutan: 5,
        waktu_mulai: '12:00:00',
        waktu_selesai: '13:00:00',
        judul_sesi: 'Lunch',
        deskripsi: 'Makan siang',
        vendor_id: 1,
        status: 'belum',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('rundowns', null, {});
  },
};
