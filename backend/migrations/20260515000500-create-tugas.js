'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tugas', {
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
      rundown_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'rundowns',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      judul: {
        allowNull: false,
        type: Sequelize.STRING(150),
      },
      deskripsi: {
        type: Sequelize.TEXT,
      },
      assignee_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      divisi: {
        type: Sequelize.STRING(50),
      },
      prioritas: {
        allowNull: false,
        defaultValue: 'sedang',
        type: Sequelize.ENUM('rendah', 'sedang', 'tinggi', 'kritis'),
      },
      status: {
        allowNull: false,
        defaultValue: 'belum',
        type: Sequelize.ENUM('belum', 'proses', 'selesai', 'terkendala'),
      },
      deadline: {
        type: Sequelize.DATE,
      },
      lampiran_url: {
        type: Sequelize.STRING(255),
      },
      catatan: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('tugas');
  },
};