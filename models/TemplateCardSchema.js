const mongoose = require('mongoose');

const TemplateCardSchema = new mongoose.Schema({
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
  topicTags: [String],
  hasSolution: Boolean,
  hasVideoSolution: Boolean,
  acRateRaw: Number,
  totalAccepted: Number,
  totalSubmission: Number,
  link: String
});

// official collection
const TemplateCard = mongoose.model('TemplateCard', TemplateCardSchema, 'cards info(08/09/2023)');
//cards test collection
// const Card = mongoose.model('TemplateCard', cardSchema, 'cards test');

module.exports = TemplateCard;
