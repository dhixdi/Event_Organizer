const router = require('express').Router();
const rundownController = require('../../controllers/rundownController');
const roleMiddleware = require('../../middleware/roleMiddleware');
const { validate } = require('../../middleware/validationMiddleware');
const { idParamSchema } = require('../../validators/commonSchemas');
const { rundownUpdateSchema } = require('../../validators/rundownSchemas');

router.put('/:id', roleMiddleware(['admin', 'ketua']), validate(idParamSchema, 'params'), validate(rundownUpdateSchema), rundownController.updateRundown);
router.delete('/:id', roleMiddleware(['admin', 'ketua']), validate(idParamSchema, 'params'), rundownController.deleteRundown);

module.exports = router;