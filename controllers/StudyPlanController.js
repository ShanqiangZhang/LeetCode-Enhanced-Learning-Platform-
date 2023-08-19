const UserCard = require('../models/UserCardSchema');

exports.getAllDueCards = async (req, res) => {
  try {
    const userId = req.user._id;
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
    // const userId = req.user._id;
    const userCardId = req.params.cardId; // 从URL路径中获取
    // console.log(req.params);
    // console.log(userCardId);
    const { buttonType: buttonTypeString } = req.body; // 从请求体中获取
    const buttonType = parseInt(buttonTypeString, 10);
    // console.log('用户按下了: ', buttonType);

    const userCard = await UserCard.findById(userCardId);
    if (!userCard) {
      console.log(`User card not found for id: ${userCardId}`);
      return res.status(404).json({ error: `User card not found for id: ${userCardId}` });
    }
    let { curBucket } = userCard;
    // console.log('当前桶: ', curBucket);
    let daysToAdd = 0;
    const studyRecord = { studyDate: new Date(), bucket: curBucket };
    if (buttonType === 1) {
      daysToAdd = 1;
      curBucket = 1;
    } else if (buttonType === 2) {
      daysToAdd = 3;
      curBucket = 2;
    } else if (buttonType === 3) {
      daysToAdd = 7;
      curBucket = 3;
    } else if (buttonType === 4) {
      if (curBucket < 4) curBucket = 4;
      else curBucket += 1;
      if (curBucket === 4) {
        daysToAdd = 15;
      } else if (curBucket === 5) {
        daysToAdd = 30;
      } else if (curBucket === 6) {
        daysToAdd = 60;
      } else if (curBucket === 7) {
        daysToAdd = 360;
      } else {
        daysToAdd = 360 * 5;
      }
    } else {
      console.log('Invalid button type');
    }

    // console.log('下一次的桶: ', curBucket);
    const nextStudyDate = new Date(userCard.nextStudyDate);
    // console.log('这次学习时间: ', nextStudyDate);
    nextStudyDate.setDate(nextStudyDate.getDate() + daysToAdd);
    // console.log('下一次时间: ', nextStudyDate);

    userCard.studyHistory.push(studyRecord);
    const updatedUserCard = await UserCard.findByIdAndUpdate(
      userCardId,
      {
        $push: { studyHistory: studyRecord },
        nextStudyDate,
        curBucket
      },
      { new: true }
    );

    res.json(updatedUserCard);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
