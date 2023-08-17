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

exports.updateStudyProgress = async (req, res) => {
  try {
    const { userCardId, buttonType: buttonTypeString } = req.params;
    const buttonType = parseInt(buttonTypeString, 10);

    const userCard = await UserCard.findById(userCardId);
    if (!userCard) {
      return res.status(404).json({ error: `User card not found for id: ${userCardId}` });
    }
    let { curBucket } = userCard;
    let daysToAdd = 0;
    const studyRecord = { studyDate: new Date(), bucket: curBucket };
    switch (buttonType) {
      case 1:
        daysToAdd = 1;
        curBucket = 1;
        break;
      case 2:
        daysToAdd = 3;
        curBucket = 2;
        break;
      case 3:
        daysToAdd = 7;
        curBucket = 3;
        break;
      case 4:
        curBucket += 1;
        switch (curBucket) {
          case 4:
            daysToAdd = 15;
            break;
          case 5:
            daysToAdd = 30;
            break;
          case 6:
            daysToAdd = 60;
            break;
          case 7:
            daysToAdd = 360;
            break;
          default:
            console.log('Invalid bucket number');
        }
        break;
      default:
        console.log('Invalid button type');
    }
    const nextStudyDate = new Date(userCard.nextStudyDate);
    nextStudyDate.setDate(nextStudyDate.getDate() + daysToAdd);

    userCard.studyHistory.push(studyRecord);
    const updatedUserCard = await UserCard.findByIdAndUpdate(
      userCardId,
      { nextStudyDate, curBucket },
      { new: true }
    );
    res.json(updatedUserCard);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
