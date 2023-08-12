/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line import/no-extraneous-dependencies
const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TemplateCard = require('../models/TemplateCardSchema');
const connectDB = require('../DBConfig/dbConnect');

dotenv.config({ path: './config.env' });

connectDB().then(async () => {
  // get data from url
  const dataUrl = process.env.DATA_URL;
  const response = await axios.get(dataUrl);
  const { data } = response;

  console.log('Database connected');
  console.time('insertOrUpdateCards');
  // get existing cards from database for comparison
  const existingCards = await TemplateCard.find({});
  const existingCardMap = existingCards.reduce((map, card) => {
    map[card.questionId] = card;
    return map;
  }, {});

  // prepare bulk operations
  const bulkOps = [];

  for (const item of data) {
    // modify topicTags
    item.topicTags = item.topicTags
      .split(';')
      .filter((tag) => tag.trim() !== '');

    // add link with titleSlug
    item.link = `https://www.leetcode.com/problems/${item.titleSlug}/`;

    // check if card already exists in database
    if (existingCardMap[item.questionId]) {
      // update existing card
      bulkOps.push({
        updateOne: {
          filter: { questionId: item.questionId },
          update: {
            $set: item
          }
        }
      });
    } else {
      // insert new card
      bulkOps.push({
        insertOne: {
          document: item
        }
      });
    }
  }

  TemplateCard.bulkWrite(bulkOps)
    .then(() => {
      console.log('All cards inserted or updated successfully.');
      console.timeEnd('insertOrUpdateCards');
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error(err);
      mongoose.connection.close();
    });
});
