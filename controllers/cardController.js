const TemplateCard = require('../models/TemplateCardSchema');

exports.getAllCards = (req, res) => {
  TemplateCard.find({})
    .then((cards) => res.json(cards))
    .catch((err) => res.status(500).json(err));
};

exports.getCardById = async (req, res, next) => {
  const paramId = req.params.id;
  const questionId = parseInt(paramId, 10);
  if (isNaN(questionId)) {
    return res.status(400).json({ message: 'invalid questionId' });
  }
  try {
    const card = await TemplateCard.findOne({ questionId: questionId });
    //等同于 const card = Card.findById(re.params.id);
    if (!card) {
      return res.status(404).json({ message: 'card not found' });
    }
    res.json(card);
  } catch (err) {
    res.status(500).json(err);
  }
};
