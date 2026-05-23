const db = require('../models/sql');
const { Op } = require('sequelize');
const { successResponse, errorResponse } = require('../utils/response');
const { getPaginationParams, buildPaginationMeta, getSortParams } = require('../utils/pagination');

const ALLOWED_ROLES = ['admin', 'ketua', 'staf'];

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    divisi: user.divisi,
    phone: user.phone,
    avatar_url: user.avatar_url,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

async function listUsers(req, res, next) {
  try {
    const { page, perPage, offset, limit } = getPaginationParams(req.query);
    const { sortBy, order } = getSortParams(req.query, {
      allowedSortBy: ['created_at', 'name', 'email', 'role'],
      defaultSortBy: 'created_at',
      defaultOrder: 'DESC',
    });
    const where = {};

    if (req.query.role) {
      where.role = req.query.role;
    }

    if (req.query.divisi) {
      where.divisi = req.query.divisi;
    }

    if (req.query.is_active !== undefined) {
      where.is_active = req.query.is_active;
    }

    if (req.query.q) {
      where[Op.or] = [
        { name: { [Op.like]: `%${req.query.q}%` } },
        { email: { [Op.like]: `%${req.query.q}%` } },
      ];
    }

    const { rows, count } = await db.User.findAndCountAll({
      attributes: { exclude: ['password_hash'] },
      where,
      order: [[sortBy, order]],
      offset,
      limit,
    });

    return successResponse(res, {
      message: 'Daftar user berhasil diambil',
      data: { users: rows.map(sanitizeUser) },
      meta: buildPaginationMeta({ page, perPage, total: count }),
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const userId = req.params.id;
    const user = await db.User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      return errorResponse(res, { message: 'User tidak ditemukan', statusCode: 404 });
    }

    return successResponse(res, {
      message: 'Detail user berhasil diambil',
      data: { user: sanitizeUser(user) },
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const userId = req.params.id;
    const user = await db.User.findByPk(userId);

    if (!user) {
      return errorResponse(res, { message: 'User tidak ditemukan', statusCode: 404 });
    }

    const payload = {
      name: req.body.name ?? user.name,
      phone: req.body.phone ?? user.phone,
      avatar_url: req.body.avatar_url ?? user.avatar_url,
      divisi: req.body.divisi ?? user.divisi,
      is_active: req.body.is_active !== undefined ? req.body.is_active : user.is_active,
    };

    await user.update(payload);

    const refreshed = await db.User.findByPk(userId);
    return successResponse(res, {
      message: 'User berhasil diperbarui',
      data: { user: sanitizeUser(refreshed) },
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

async function updateUserRole(req, res, next) {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    if (!role) {
      return errorResponse(res, { message: 'Role wajib diisi', statusCode: 400 });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return errorResponse(res, {
        message: 'Role tidak valid',
        statusCode: 400,
        errors: [{ field: 'role', message: 'Role harus admin, ketua, atau staf' }],
      });
    }

    const user = await db.User.findByPk(userId);
    if (!user) {
      return errorResponse(res, { message: 'User tidak ditemukan', statusCode: 404 });
    }

    await user.update({ role });

    const refreshed = await db.User.findByPk(userId);
    return successResponse(res, {
      message: 'Role user berhasil diperbarui',
      data: { user: sanitizeUser(refreshed) },
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const userId = req.params.id;
    const deletedRows = await db.User.destroy({ where: { id: userId } });

    if (!deletedRows) {
      return errorResponse(res, { message: 'User tidak ditemukan', statusCode: 404 });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { listUsers, getUserById, updateUser, updateUserRole, deleteUser };