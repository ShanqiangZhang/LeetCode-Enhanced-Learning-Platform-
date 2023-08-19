const express = require('express');
const StudyPlanController = require('../controllers/StudyPlanController');

const router = express.Router();

router.route('/').get(StudyPlanController.getAllDueCards);
router.route('/:cardId').patch(StudyPlanController.updateStudyProgress);

module.exports = router;
