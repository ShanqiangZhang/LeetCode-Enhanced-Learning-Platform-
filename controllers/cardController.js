/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable node/no-unsupported-features/es-syntax */
const TemplateCard = require('../models/TemplateCardSchema');
const UserCard = require('../models/UserCardSchema');

exports.getAllCards = async (req, res) => {
  try {
    // const userId = req.user._id;
    //test user id
    const userId = '64d703415f9dabd0ff66396c';
    const userCards = await UserCard.find({ userId }).populate('card');
    const selectedTemplateCardIds = userCards.map((userCard) => userCard.card._id.toString());
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

exports.addLeetCodeCard = async (req, res, next) => {
  try {
    // const userId = req.user._id;
    //test user id
    const userId = '64d703415f9dabd0ff66396c';
    const { templateCardIds } = req.body;

    const newUserCardsData = [];
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
      newUserCardsData.push({
        userId,
        card: templateCardId,
        timestamp: new Date(),
        nextStudyDate: new Date(),
        curBucket: 1
      });
    }
    // 创建并保存所有新用户卡片
    const userCards =
      newUserCardsData.length > 0 ? await UserCard.insertMany(newUserCardsData) : [];

    // 返回新创建的用户卡片（如果需要）
    res.json(userCards);
  } catch (err) {
    res.status(500).json(err);
    console.error(err);
  }
};

// exports.getCardById = async (req, res, next) => {
//   const paramId = req.params.id;
//   const questionId = parseInt(paramId, 10);
//   if (isNaN(questionId)) {
//     return res.status(400).json({ message: 'invalid questionId' });
//   }
//   try {
//     const card = await TemplateCard.findOne({ questionId: questionId });
//     //等同于 const card = Card.findById(re.params.id);
//     if (!card) {
//       return res.status(404).json({ message: 'card not found' });
//     }
//     res.json(card);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };
