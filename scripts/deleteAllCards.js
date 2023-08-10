const mongoose = require('mongoose');
const Card = require('../models/cardSchema');
const connectDB = require('../DBConfig/dbConnect');

connectDB()
  .then(() => {
    console.log('Database connected');
    return Card.deleteMany({});
  })
  .then(() => {
    console.log('All documents in the Card collection have been deleted.');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
    mongoose.connection.close();
  });
