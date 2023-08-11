const mongoose = require('mongoose');
const TemplateCard = require('../../models/TemplateCardSchema');
const connectDB = require('../../DBConfig/dbConnect');

connectDB()
  .then(() => {
    console.log('Database connected');
    console.time('updateTopicTags');

    return TemplateCard.find({});
  })
  .then((cards) => {
    const bulkOps = cards.map((card) => {
      const tagString = card.topicTags?.[0];
      const tagsArray =
      tagString ? tagString.split(';').filter(tag => tag) : [];
      return {
        updateOne: {
          filter: { _id: card._id },
          update: {
            $set: {
              topicTags: tagsArray,
            },
          },
        },
      };
    });

    return Card.bulkWrite(bulkOps);
  })
  .then(() => {
    console.log('All topicTags updated successfully.');
    console.timeEnd('updateTopicTags');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });
