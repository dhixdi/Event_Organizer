const router = require('express').Router();
const userController = require('../../controllers/userController');
const roleMiddleware = require('../../middleware/roleMiddleware');
const ownerMiddleware = require('../../middleware/ownerMiddleware');

router.get('/', roleMiddleware(['admin', 'ketua']), userController.listUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', ownerMiddleware('id'), userController.updateUser);
router.patch('/:id/role', roleMiddleware(['admin']), userController.updateUserRole);
router.delete('/:id', roleMiddleware(['admin']), userController.deleteUser);

module.exports = router;