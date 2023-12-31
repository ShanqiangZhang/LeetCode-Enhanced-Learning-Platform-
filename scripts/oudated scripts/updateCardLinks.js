const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TemplateCard = require('../../models/TemplateCardSchema');
const connectDB = require('../../DBConfig/dbConnect');

dotenv.config({ path: './config.env' });

connectDB()
  .then(() => {
    const dbName = mongoose.connection.db.databaseName;
    console.log('database connected', dbName);
    const cursor = TemplateCard.find({}).cursor();

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
