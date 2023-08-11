const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true }, // Google的用户ID，用于唯一识别用户
  name: String,
  email: { type: String, unique: true },
  avatar: String, // 用户的头像URL
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserCard' }] // 用户的卡片，与UserCard集合相关联
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
