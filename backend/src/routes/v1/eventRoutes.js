const router = require('express').Router();
const eventController = require('../../controllers/eventController');
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware');
const { validate } = require('../../middleware/validationMiddleware');
const { idParamSchema } = require('../../validators/commonSchemas');
const { eventCreateSchema, eventUpdateSchema } = require('../../validators/eventSchemas');
const { eventListQuerySchema } = require('../../validators/listQuerySchemas');

router.use(authMiddleware);

router.post('/', roleMiddleware(['admin', 'ketua']), validate(eventCreateSchema), eventController.createEvent);
router.get('/', validate(eventListQuerySchema, 'query'), eventController.listEvents);
router.get('/:id', validate(idParamSchema, 'params'), eventController.getEventById);
router.put('/:id', roleMiddleware(['admin', 'ketua']), validate(idParamSchema, 'params'), validate(eventUpdateSchema), eventController.updateEvent);
router.delete('/:id', roleMiddleware(['admin']), validate(idParamSchema, 'params'), eventController.deleteEvent);

module.exports = router;