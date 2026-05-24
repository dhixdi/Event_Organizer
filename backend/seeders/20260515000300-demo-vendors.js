'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('vendors', [
      {
        id: 1,
        nama_vendor: 'Catering Mitra Jaya',
        kategori: 'Catering',
        kontak_person: 'Pak Budiman',
        telepon: '081200001111',
        email: 'catering@mitrajaya.com',
        alamat: 'Jl. Raya Depok No. 45, Jakarta',
        status: 'aktif',
        event_id: 1,
        created_at: new Date(),
      },
      {
        id: 2,
        nama_vendor: 'Dekorasi Elegan Premium',
        kategori: 'Dekorasi',
        kontak_person: 'Ibu Siti',
        telepon: '081200002222',
        email: 'dekorasi@elegancepremium.co.id',
        alamat: 'Jl. Sultan Iskandar Muda, Jakarta Selatan',
        status: 'aktif',
        event_id: 1,
        created_at: new Date(),
      },
      {
        id: 3,
        nama_vendor: 'Sound & Light Pro',
        kategori: 'Sound System',
        kontak_person: 'Mas Hendra',
        telepon: '081200003333',
        email: 'info@soundlightpro.com',
        alamat: 'Jl. Gatot Subroto No. 123, Jakarta',
        status: 'aktif',
        event_id: 1,
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('vendors', null, {});
  },
};
