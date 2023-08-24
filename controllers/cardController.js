/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable node/no-unsupported-features/es-syntax */
const TemplateCard = require('../models/TemplateCardSchema');
const UserCard = require('../models/UserCardSchema');
const User = require('../models/UserSchema');

exports.getAllCards = async (req, res) => {
  try {
    // console.log('Request Headers:', req.headers);
    // console.log('Request Body:', req.body);
    // console.log('Request Query:', req.query);

    const userId = req.user._id;
    const userCards = await UserCard.find({ userId }).populate('card');
    const selectedTemplateCardIds = userCards.map((userCard) => userCard.card._id.toString());
    const templateCards = await TemplateCard.find();
    // console.log('Template Cards:', templateCards);
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

exports.addLeetCodeCard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const receivedData = req.body;

    // Ensure the received data is an array
    if (!Array.isArray(receivedData)) {
      throw new Error('Expected an array of objects');
    }

    // Extract _id into a new array
    const templateCardIds = receivedData.map((card) => card._id);

    const newUserCardsData = [];
    const curUser = await User.findById(userId);

    for (const templateCardId of templateCardIds) {
      const templateCard = await TemplateCard.findById(templateCardId);

      if (!templateCard) {
        throw new Error(`Template card not found for id: ${templateCardId}`);
      }

      const existingUserCard = await UserCard.findOne({
        userId,
        card: templateCardId
      });

      if (existingUserCard) {
        console.log('User card already exists for this user and template card.');
        continue;
      }

      const newUserCardData = {
        userId,
        card: templateCardId,
        timestamp: new Date(),
        nextStudyDate: new Date(),
        curBucket: 1
      };
      // Create the user card
      const createdUserCard = await UserCard.create(newUserCardData);
      curUser.cards.push(createdUserCard);

      newUserCardsData.push(createdUserCard);
    }

    // Save the updated user object
    await curUser.save();

    // Return the newly created user cards
    res.json(newUserCardsData);
  } catch (err) {
    res.status(500).json(err);
    console.error(err);
  }
};
