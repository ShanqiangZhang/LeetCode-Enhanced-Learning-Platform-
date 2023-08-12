/* eslint-disable node/no-unsupported-features/es-syntax */
const TemplateCard = require('../models/TemplateCardSchema');
const UserCard = require('../models/UserCardSchema');

/**
 * Retrieves all template cards and marks the ones selected by a specific user.
 *
 * 1. Finds all UserCard documents associated with the given userId and populates the card field.
 * 2. Extracts the TemplateCard IDs from the UserCard documents.
 * 3. Retrieves all TemplateCards and creates a new object for each one with an additional 'selected' field.
 *    The 'selected' field is set to true if the TemplateCard ID is found in the extracted IDs from step 2.
 * 4. Sends a JSON response with the augmented TemplateCards.
 *
 * @async
 * @param {Object} req - The request object, containing user information.
 * @param {Object} res - The response object.
 * @throws {Error} If there's an error in retrieving the data from the database.
 */
exports.getAllCards = async (req, res) => {
  try {
    // const userId = req.user._id;
    //test user id
    const userId = '64d703415f9dabd0ff66396c';
    const userCards = await UserCard.find({ userId }).populate('card');
    const selectedTemplateCardIds = userCards.map((userCard) =>
      userCard.card._id.toString()
    );
    const templateCards = await TemplateCard.find();
    const cardsWithSelection = templateCards.map((card) => ({
      ...card._doc,
      selected: selectedTemplateCardIds.includes(card._id.toString())
    }));
    res.json(cardsWithSelection);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
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
