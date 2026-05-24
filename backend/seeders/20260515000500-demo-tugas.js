'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tugas', [
      {
        id: 1,
        event_id: 1,
        judul: 'Persiapan tempat dan setup meja',
        deskripsi: 'Setup ruangan untuk registrasi peserta',
        assignee_id: 3,
        divisi: 'Divisi Dekorasi',
        prioritas: 'tinggi',
        status: 'belum',
        deadline: '2026-05-20 08:00:00',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        event_id: 1,
        judul: 'Persiapan menu dan minuman',
        deskripsi: 'Koordinasi dengan vendor catering untuk menu',
        assignee_id: 4,
        divisi: 'Divisi Catering',
        prioritas: 'tinggi',
        status: 'belum',
        deadline: '2026-05-20 07:00:00',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        event_id: 1,
        judul: 'Setup sound system dan microphone',
        deskripsi: 'Pastikan semua alat sound berfungsi dengan baik',
        assignee_id: 5,
        divisi: 'Divisi Sound System',
        prioritas: 'kritis',
        status: 'belum',
        deadline: '2026-05-20 06:00:00',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        event_id: 1,
        judul: 'Print dan persiapan dokumentasi peserta',
        deskripsi: 'Siapkan name tag, sertifikat, dan dokumentasi lainnya',
        assignee_id: 3,
        divisi: 'Divisi Dekorasi',
        prioritas: 'sedang',
        status: 'belum',
        deadline: '2026-05-19 17:00:00',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        event_id: 1,
        judul: 'Koordinasi dengan pembicara utama',
        deskripsi: 'Konfirmasi kehadiran dan slide presentasi speaker',
        assignee_id: 2,
        prioritas: 'tinggi',
        status: 'belum',
        deadline: '2026-05-18 17:00:00',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tugas', null, {});
  },
};
