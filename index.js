const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const Card = require('./models/cardSchema');

const app = express();

//1. connect database
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected database');
    console.log('Connected to database', mongoose.connection.db.databaseName);
  })
  .catch((err) => console.log('connected failed', err));

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
