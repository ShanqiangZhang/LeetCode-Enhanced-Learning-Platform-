const express = require('express');
const TemplateCardController = require('../controllers/cardController');
const jwtMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(jwtMiddleware, TemplateCardController.getAllCards);
router.route('/addCard').post(jwtMiddleware, TemplateCardController.addLeetCodeCard);

module.exports = router;
