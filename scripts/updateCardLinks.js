const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Card = require('../models/cardSchema');
const connectDB = require('../DBConfig/dbConnect');

dotenv.config({ path: './config.env' });

connectDB()
  .then(() => {
    console.log('database connected');
    const cursor = Card.find({}).cursor();

    console.time('updateCardLinks');
    cursor
      .eachAsync((card) => {
        card.link = `https://www.leetcode.com/problems/${card.titleSlug}/`;
        return card.save();
      })
      .then(() => {
        console.log('all cards updated successfully.');
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        console.timeEnd('updateCardLinks');
        mongoose.connection.close();
        process.exit();
      });
  })
  .catch((err) => {
    console.error('database connection failed:', err);
  });
