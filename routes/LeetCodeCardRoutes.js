const express = require('express');
const cardController = require('../controllers/cardController');

const router = express.Router();

router.route('/').get(cardController.getAllCards);
router.route('/:id').get(cardController.getCardById);

module.exports = router;
