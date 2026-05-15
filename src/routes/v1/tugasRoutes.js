const router = require('express').Router();
const tugasController = require('../../controllers/tugasController');
const db = require('../../models/sql');
const ownerMiddleware = require('../../middleware/ownerMiddleware');

const getTugasAssigneeId = async (req) => {
  const tugas = await db.Tugas.findByPk(req.params.id);
  return tugas?.assignee_id;
};

router.get('/:id', tugasController.getTugasById);
router.put('/:id', tugasController.updateTugas);
router.patch('/:id/status', ownerMiddleware(getTugasAssigneeId, 'id'), tugasController.updateTugasStatus);
router.delete('/:id', tugasController.deleteTugas);

module.exports = router;