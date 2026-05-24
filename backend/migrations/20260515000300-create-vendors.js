'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vendors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nama_vendor: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      kategori: {
        type: Sequelize.STRING(50),
      },
      kontak_person: {
        type: Sequelize.STRING(100),
      },
      telepon: {
        type: Sequelize.STRING(20),
      },
      email: {
        type: Sequelize.STRING(100),
      },
      alamat: {
        type: Sequelize.TEXT,
      },
      kontrak_url: {
        type: Sequelize.STRING(255),
      },
      event_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'events',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        allowNull: false,
        defaultValue: 'aktif',
        type: Sequelize.ENUM('aktif', 'selesai', 'batal'),
      },
      catatan: {
        type: Sequelize.TEXT,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('vendors');
  },
};