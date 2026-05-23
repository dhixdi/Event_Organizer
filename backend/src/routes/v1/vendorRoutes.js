const router = require('express').Router();
const vendorController = require('../../controllers/vendorController');
const roleMiddleware = require('../../middleware/roleMiddleware');
const { validate } = require('../../middleware/validationMiddleware');
const { idParamSchema } = require('../../validators/commonSchemas');
const { vendorUpdateSchema } = require('../../validators/vendorSchemas');

router.get('/:id', validate(idParamSchema, 'params'), vendorController.getVendorById);
router.put('/:id', roleMiddleware(['admin', 'ketua']), validate(idParamSchema, 'params'), validate(vendorUpdateSchema), vendorController.updateVendor);
router.delete('/:id', roleMiddleware(['admin', 'ketua']), validate(idParamSchema, 'params'), vendorController.deleteVendor);

module.exports = router;