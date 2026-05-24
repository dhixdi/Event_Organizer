'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rundowns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      urutan: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      waktu_mulai: {
        allowNull: false,
        type: Sequelize.TIME,
      },
      waktu_selesai: {
        type: Sequelize.TIME,
      },
      judul_sesi: {
        allowNull: false,
        type: Sequelize.STRING(150),
      },
      deskripsi: {
        type: Sequelize.TEXT,
      },
      pic_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'vendors',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      status: {
        allowNull: false,
        defaultValue: 'belum',
        type: Sequelize.ENUM('belum', 'berjalan', 'selesai', 'ditunda'),
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
    await queryInterface.dropTable('rundowns');
  },
};