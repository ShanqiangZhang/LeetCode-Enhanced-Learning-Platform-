const express = require('express');
const TemplateCardController = require('../controllers/cardController');

const router = express.Router();

router.route('/').get(TemplateCardController.getAllCards);
router.route('/addCard').post(TemplateCardController.addLeetCodeCard);

module.exports = router;
