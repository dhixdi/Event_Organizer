'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nama_event: {
        allowNull: false,
        type: Sequelize.STRING(150),
      },
      deskripsi: {
        type: Sequelize.TEXT,
      },
      lokasi: {
        type: Sequelize.STRING(200),
      },
      tanggal_mulai: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      tanggal_selesai: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      status: {
        allowNull: false,
        defaultValue: 'draft',
        type: Sequelize.ENUM('draft', 'aktif', 'selesai', 'batal'),
      },
      ketua_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('events');
  },
};