const mongoose = require('mongoose');
const UserCard = require('../../models/UserCardSchema');
const connectDB = require('../../DBConfig/dbConnect');
const User = require('../../models/UserSchema');

connectDB()
  .then(async () => {
    console.log('Database connected');
    const userIdToDelete = '64e448ebe5cee89236a43bc3';
    try {
      const response = await UserCard.deleteMany({ userId: userIdToDelete });
      console.log(`Deleted ${response.deletedCount} cards associated with user ${userIdToDelete}`);
      const userToUpdate = await User.findById(userIdToDelete);
      if (userToUpdate) {
        userToUpdate.cards = [];
        await userToUpdate.save();
        console.log('User cards attribute reset.');
      } else {
        console.log(`User with ID ${userIdToDelete} not found.`);
      }
      mongoose.connection.close(); // 关闭数据库连接
    } catch (error) {
      console.error('Error while deleting cards:', error);
      mongoose.connection.close();
    }
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });
