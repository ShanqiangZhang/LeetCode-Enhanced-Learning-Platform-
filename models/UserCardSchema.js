const mongoose = require('mongoose');

const UserCardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  card: { type: mongoose.Schema.Types.ObjectId, ref: 'TemplateCard' }, // 引用模板卡片
  timestamp: Date,
  nextStudyDate: Date, // 下次学习日期
  curBucket: Number,
  studied: {
    type: Boolean,
    default: false
  },
  studyHistory: [
    {
      studyDate: Date,
      bucket: Number
    }
  ]
});

const UserCard = mongoose.model('UserCard', UserCardSchema, 'user-cards');
module.exports = UserCard;
