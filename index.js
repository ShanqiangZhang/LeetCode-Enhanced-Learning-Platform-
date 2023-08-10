const express = require('express');
const mongoose = require('mongoose');
const Card = require('./models/cardSchema');
const connectDB = require('./DBConfig/dbConnect');

const LeetCodeCardRouter = require('./routes/LeetCodeCardRoutes');

const app = express();

//1. connect database
connectDB()
  .then(() => {
    const dbName = mongoose.connection.db.databaseName;
    console.log('connected to database:', dbName);
  })
  .catch((err) => {
    console.log('connected  falied', err);
  });

// 2.router
app.use('/leetcode-cards', LeetCodeCardRouter);
app.get('/', (req, res) => {
  res.send('hello form root');
});

//3. start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
