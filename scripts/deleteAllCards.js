const mongoose = require('mongoose');
const TemplateCard = require('../models/TemplateCardSchema');
const connectDB = require('../DBConfig/dbConnect');

connectDB()
  .then(() => {
    console.log('Database connected');
    return TemplateCard.deleteMany({});
  })
  .then(() => {
    console.log('All documents in the Card collection have been deleted.');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });
