const express = require('express');
const TemplateCardController = require('../controllers/cardController');

const router = express.Router();

router.route('/').get(TemplateCardController.getAllCards);
router.route('/:id').get(TemplateCardController.getCardById);

module.exports = router;
