'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tugas', null, {});
    await queryInterface.bulkDelete('rundowns', null, {});
    await queryInterface.bulkDelete('vendors', null, {});
    await queryInterface.bulkDelete('laporan_ketua', null, {});
    await queryInterface.bulkDelete('events', null, {});
    await queryInterface.bulkDelete('users', null, {});

    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@gmail.com',
        password_hash: await bcrypt.hash('admin123', 10),
        role: 'admin',
        divisi: 'Admin',
        phone: '082100000001',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'Ketua Panitia',
        email: 'ketua@gmail.com',
        password_hash: await bcrypt.hash('ketua123', 10),
        role: 'ketua',
        divisi: 'Panitia Inti',
        phone: '082100000002',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: 'Staf EO',
        email: 'staf@gmail.com',
        password_hash: await bcrypt.hash('staf123', 10),
        role: 'staf',
        divisi: 'Divisi Dekorasi',
        phone: '082100000003',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        name: 'Staf Catering',
        email: 'catering@gmail.com',
        password_hash: await bcrypt.hash('catering123', 10),
        role: 'staf',
        divisi: 'Divisi Catering',
        phone: '082100000004',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        name: 'Staf Sound System',
        email: 'sound@gmail.com',
        password_hash: await bcrypt.hash('sound123', 10),
        role: 'staf',
        divisi: 'Divisi Sound System',
        phone: '082100000005',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
