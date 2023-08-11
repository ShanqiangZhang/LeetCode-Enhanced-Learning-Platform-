const mongoose = require('mongoose');

const UserCardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  card: { type: mongoose.Schema.Types.ObjectId, ref: 'TemplateCard' },
  timestamp: Date,
  nextStudyDate: Date,
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
  ],
  Note: {
    type: String,
    trim: true,
    default: ''
  }
});

const UserCard = mongoose.model('UserCard', UserCardSchema, 'user-cards');
module.exports = UserCard;
