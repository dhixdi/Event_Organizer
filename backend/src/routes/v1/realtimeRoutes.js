const router = require('express').Router();
const realtimeController = require('../../controllers/realtimeController');
const roleMiddleware = require('../../middleware/roleMiddleware');

router.post('/checklist', realtimeController.createChecklist);
router.get('/events/:eventId/checklist', roleMiddleware(['admin', 'ketua']), realtimeController.listChecklistByEvent);
router.patch('/checklist/:id/status', realtimeController.updateChecklistStatus);

router.post('/chat/messages', realtimeController.sendChatMessage);
router.get('/events/:eventId/chat', realtimeController.listChatByEvent);

router.post('/notifikasi', roleMiddleware(['admin', 'ketua']), realtimeController.createNotification);
router.get('/notifikasi/me', realtimeController.listMyNotifications);
router.patch('/notifikasi/:id/read', realtimeController.markNotificationRead);

router.post('/rundown-changes', roleMiddleware(['admin', 'ketua']), realtimeController.createRundownChange);
router.get('/events/:eventId/rundown-changes', realtimeController.listRundownChangesByEvent);

router.post('/logs', realtimeController.createKoordinasiLog);
router.get('/events/:eventId/logs', roleMiddleware(['admin', 'ketua']), realtimeController.listKoordinasiLogByEvent);

module.exports = router;
