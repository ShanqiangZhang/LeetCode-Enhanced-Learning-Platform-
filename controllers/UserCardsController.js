const UserCard = require('../models/UserCardSchema');

exports.getAllUserCards = async (req, res) => {
  try {
    // console.log(req);
    // console.log('Request Headers:', req.headers);
    // console.log('Request Body:', req.body);
    // console.log('Request Query:', req.query);
    // console.log('req for getAllUserCards');
    // console.log(req.user._id);
    const userId = req.user._id;
    const userCards = await UserCard.find({ userId }).populate('card');
    // console.log(userCards);
    res.json(userCards);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

exports.deleteUserCards = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cardId } = req.params;
    await UserCard.findOneAndDelete({ userId, _id: cardId });
    res.json({ message: 'Card deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

exports.resetStudyHistory = async (req, res) => {
  // console.log('reset card executed');
  try {
    const userId = req.user._id;
    const { cardId } = req.params;

    const updates = {
      timestamp: new Date(),
      nextStudyDate: new Date(),
      curBucket: 1,
      Note: '',
      studyHistory: []
    };
    const card = await UserCard.findOneAndUpdate({ userId, _id: cardId }, { $set: updates });
    // console.log(card);
    res.json({ message: 'Card reset successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
