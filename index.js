const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // 添加cookie-parser模块
const jwt = require('jsonwebtoken');
const connectDB = require('./DBConfig/dbConnect');
require('./auth/passport-setup');
const jwtMiddleware = require('./middlewares/authMiddleware');

const LeetCodeCardRouter = require('./routes/LeetCodeCardRoutes');
const StudyPlanRouter = require('./routes/StudyPlanRoutes');
const authRouter = require('./auth/authRoutes');
const UserCardsRouter = require('./routes/UserCardsRoutes');

const app = express();
app.use(express.json());

// CORS配置
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // 添加CORS中间件

// 使用cookie-parser
app.use(cookieParser());

// 会话配置
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true
  })
);

// 在会话配置后初始化 passport
app.use(passport.initialize());
app.use(passport.session());

// 1. connect database
connectDB()
  .then(() => {
    const dbName = mongoose.connection.db.databaseName;
    console.log('connected to database:', dbName);
  })
  .catch((err) => {
    console.log('connected failed', err);
  });

// 2. router
app.get('/', (req, res) => {
  res.send('hello form root');
});

// app.use(jwtMiddleware);
app.use('/v1/leetcode-cards', jwtMiddleware, LeetCodeCardRouter);
app.use('/v1/study-plan', jwtMiddleware, StudyPlanRouter);
app.use('/v1/auth', authRouter);
app.use('/v1/user-cards', jwtMiddleware, UserCardsRouter);

// 3. start server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
