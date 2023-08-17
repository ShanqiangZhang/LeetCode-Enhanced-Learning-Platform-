const express = require('express');
const UserCardsController = require('../controllers/UserCardsController');

const router = express.Router();

router.route('/').get(UserCardsController.getAllUserCards);
router.route('/:cardId').delete(UserCardsController.deleteUserCards);
router.route('/:cardId/reset').patch(UserCardsController.resetStudyHistory);

module.exports = router;
