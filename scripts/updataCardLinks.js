const Card = require('../models/cardSchema');

Card.find({})
  .then((cards) => {
    cards.forEach((card) => {
      card.link = `https://www.leetcode.com/problems/${card.titleSlug}/`;
      card.save().catch((err) => {
        console.error(err);
      });
    });
  })
  .catch((err) => {
    console.error(err);
  });
