const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  questionId: Number,
  title: String,
  titleSlug: String,
  isPaidOnly: Boolean,
  difficulty: String,
  likes: Number,
  dislikes: Number,
  categoryTitle: String,
  acRate: String,
  frontendQuestionId: Number,
  paidOnly: Boolean,
  // topicTags: String,
  topicTags: [String],
  hasSolution: Boolean,
  hasVideoSolution: Boolean,
  acRateRaw: Number,
  totalAccepted: Number,
  totalSubmission: Number,
  link: String,
});

// cardSchema.index({ titleSlug: 1 });

// official collection
const Card = mongoose.model('Card', cardSchema, 'cards info(08/09/2023)');
//cards test collection
// const Card = mongoose.model('Card', cardSchema, 'cards test');

module.exports = Card;
