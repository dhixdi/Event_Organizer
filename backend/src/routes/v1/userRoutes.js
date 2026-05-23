const router = require('express').Router();
const userController = require('../../controllers/userController');
const roleMiddleware = require('../../middleware/roleMiddleware');
const { validate } = require('../../middleware/validationMiddleware');
const { idParamSchema } = require('../../validators/commonSchemas');
const { userUpdateSchema, userRoleUpdateSchema } = require('../../validators/userSchemas');
const { userListQuerySchema } = require('../../validators/listQuerySchemas');

router.get('/', roleMiddleware(['admin', 'ketua']), validate(userListQuerySchema, 'query'), userController.listUsers);
router.get('/:id', validate(idParamSchema, 'params'), userController.getUserById);
router.put('/:id', roleMiddleware(['admin', 'ketua']), validate(idParamSchema, 'params'), validate(userUpdateSchema), userController.updateUser);
router.patch('/:id/role', roleMiddleware(['admin']), validate(idParamSchema, 'params'), validate(userRoleUpdateSchema), userController.updateUserRole);
router.delete('/:id', roleMiddleware(['admin']), validate(idParamSchema, 'params'), userController.deleteUser);

module.exports = router;