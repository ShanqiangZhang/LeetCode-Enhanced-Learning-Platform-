const mongoose = require('mongoose');
const User = require('../models/UserSchema');
const TemplateCard = require('../models/TemplateCardSchema');
const UserCard = require('../models/UserCardSchema');
const connectDB = require('../DBConfig/dbConnect');

//create user, user car and template card
// test connections between then
async function runTest() {
  try {
    //create a user
    const user = new User({
      googleId: 'google-id-2',
      name: 'User-2',
      email: 'user2@example.com',
      avatar: 'sample-avatar-url'
    });
    await user.save();
    console.log('user created:', user);

    //fetch template card
    const templateCardId = '64d698a8636d13f9e715dde9';
    const templateCard = await TemplateCard.findById(templateCardId);
    if (!templateCard) {
      console.error('No TemplateCard found with the given ID:', templateCardId);
      return;
    }
    console.log('TemplateCard fetched:', templateCard);

    //connect user card with user and template card by id
    const userCard = new UserCard({
      userId: user._id,
      card: templateCard._id,
      timestamp: new Date(),
      nextStudyDate: new Date(),
      curBucket: 1
    });
    await userCard.save();
    console.log('UserCard created:', userCard);

    //add user card into user'cards array
    user.cards.push(userCard._id);
    await user.save();

    //test connection
    const populatedUserCard = await UserCard.findById(userCard._id)
      .populate('userId')
      .populate('card');

    console.log('Populated UserCard:', populatedUserCard);

    //test find user cards by user id;
    const userWithCards = await User.findById(user._id).populate({
      path: 'cards',
      populate: {
        path: 'card',
        model: 'TemplateCard'
      }
    });
    console.log('User with populated cards:', userWithCards);
  } catch (err) {
    console.log('err', err);
  }
}

async function printUserCardInfo(googleId) {
  try {
    const user = await User.findOne({ googleId: googleId }).populate({
      path: 'cards',
      populate: {
        path: 'card',
        model: 'TemplateCard'
      }
    });

    if (!user) {
      console.log('No user found with the given googleId:', googleId);
      return;
    }

    console.log('User information:');
    console.log(user);

    console.log('Associated card information:');
    console.log(user.cards);
  } catch (err) {
    console.error(err);
  }
}

connectDB()
  .then(() => {
    console.log(mongoose.connection.db.databaseName, ' database connected');
    // return runTest();
    return printUserCardInfo('google-id-2');
  })
  .then(() => {
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });
