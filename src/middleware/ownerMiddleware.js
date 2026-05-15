const { errorResponse } = require('../utils/response');

/**
 * Factory function untuk owner middleware.
 * Mengecek apakah user yang login adalah pemilik resource.
 *
 * @param {string|function} ownerIdField - Nama field di params atau fungsi yang return owner id
 * @param {string} paramName - Nama parameter di URL (default: 'id')
 * @returns {function} Express middleware
 *
 * @example
 * // Gunakan untuk user profile: hanya user sendiri atau admin yang bisa update
 * router.put('/:id', ownerMiddleware('id'), controller.updateUser);
 *
 * @example
 * // Gunakan dengan custom function untuk resource lebih kompleks
 * router.patch('/:id/status', ownerMiddleware(async (req) => {
 *   const tugas = await db.Tugas.findByPk(req.params.id);
 *   return tugas?.assignee_id;
 * }), controller.updateTugasStatus);
 */
function ownerMiddleware(ownerIdField = 'id', paramName = 'id') {
  return async (req, res, next) => {
    try {
      const userId = req.auth?.id;
      const userRole = req.auth?.role;

      if (!userId) {
        return errorResponse(res, { message: 'Token tidak valid', statusCode: 401 });
      }

      // Admin bisa bypass ownership check
      if (userRole === 'admin') {
        return next();
      }

      // Tentukan resource owner id
      let ownerId;

      if (typeof ownerIdField === 'function') {
        // Jika ownerIdField adalah fungsi, panggil untuk mendapatkan owner id
        ownerId = await ownerIdField(req);
      } else {
        // Jika ownerIdField adalah string, ambil dari req.params
        ownerId = parseInt(req.params[paramName], 10);
      }

      // Cek apakah user adalah owner
      if (userId !== ownerId) {
        return errorResponse(res, {
          message: 'Anda tidak memiliki akses ke resource ini',
          statusCode: 403,
        });
      }

      return next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ownerMiddleware;