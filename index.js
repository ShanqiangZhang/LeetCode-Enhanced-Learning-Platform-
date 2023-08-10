const express = require('express');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
const Card = require('./models/cardSchema');
const connectDB = require('./DBConfig/dbConnect');

const app = express();

//1. connect database
connectDB()
  .then(() => {
    console.log('connected to database');
  })
  .catch((err) => {
    console.log('connected  falied', err);
  });

// 2.api
app.get('/', (req, res) => {
  res.send('hello form root');
});

app.get('/cards', (req, res) => {
  Card.find()
    .then((cards) => {
      // console.log('Cards retrieved from database:', cards);
      res.json(cards);
    })
    .catch((err) => {
      console.error('error retrieving card:', err);
      res.status(500).send('error retrieving card');
    });
});

//3. start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
