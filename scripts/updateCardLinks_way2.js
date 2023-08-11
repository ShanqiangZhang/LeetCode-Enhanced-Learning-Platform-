const mongoose = require('mongoose');
const TemplateCard = require('../models/TemplateCardSchema');
const connectDB = require('../DBConfig/dbConnect');

connectDB()
  .then(() => {
    console.log('Database connected');
    console.time('updateCards2');
    return TemplateCard.find({});
  })
  .then((cards) => {
    const bulkOps = cards.map((card) => ({
      updateOne: {
        filter: { _id: card._id },
        update: {
          $set: {
            link: `https://www.leetcode.com/problems/${card.titleSlug}/`
          }
        }
      }
    }));

    return TemplateCard.bulkWrite(bulkOps);
  })
  .then(() => {
    console.log('All cards updated successfully.');
    console.timeEnd('updateCards2');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });
