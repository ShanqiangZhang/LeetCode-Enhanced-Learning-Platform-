const UserCard = require('../models/UserCardSchema');

exports.getAllDueCards = async (req, res) => {
  try {
    // const userId = req.user._id;
    //test user id
    const userId = '64d703415f9dabd0ff66396c';
    const cards = await UserCard.find({
      userId,
      nextStudyDate: { $lte: new Date() }
    })
      .sort({ nextStudyDate: 1 })
      .populate('card');
    res.json(cards);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
