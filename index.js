const express = require('express');
const mongoose = require('mongoose');
// const Card = require('./models/TemplateCardSchema');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./DBConfig/dbConnect');
require('./auth/passport-setup');

const LeetCodeCardRouter = require('./routes/LeetCodeCardRoutes');
const StudyPlanRouter = require('./routes/StudyPlanRoutes');
const authRouter = require('./auth/authRoutes');

const app = express();
app.use(express.json());

// 会话配置
app.use(
  session({
    secret: process.env.JWT_SECRET, // 请替换为你自己的密钥
    resave: false,
    saveUninitialized: true
  })
);

// 在会话配置后初始化 passport
app.use(passport.initialize());
app.use(passport.session());

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
app.get('/', (req, res) => {
  res.send('hello form root');
});
app.use('/v1/leetcode-cards', LeetCodeCardRouter);
app.use('/v1/study-plan', StudyPlanRouter);
app.use('/v1/auth', authRouter);

//3. start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
