const router = require('express').Router();
const uploadController = require('../../controllers/uploadController');
const { uploadSingle } = require('../../middleware/uploadMiddleware');

router.post('/', uploadSingle, uploadController.uploadFile);

module.exports = router;