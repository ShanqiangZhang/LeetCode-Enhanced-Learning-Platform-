const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');
const jwtMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.log('Authentication Error:', err);
      return res.status(500).json({
        status: 'error',
        message: 'Authentication Error',
        error: err.message
      });
    }
    if (!user) {
      console.log('Authentication Failed:', info);
      return res.status(401).json({
        status: 'error',
        message: 'Authentication Failed',
        details: info.message // 这里我们假设info是一个包含message属性的对象
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.log('Session Error:', err);
        return res.status(500).json({
          status: 'error',
          message: 'Session Error',
          error: err.message
        });
      }
      // console.log('user: ', user);
      // console.log('JWT Token:', user.jwt);
      res.cookie('token', user.jwt);
      // console.log('cookie', res.cookie);
      return res.redirect('http://localhost:3000');
    });
  })(req, res, next);
});

router.get('/verify', jwtMiddleware, (req, res) => {
  const { user } = req;
  return res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    }
  });
});

router.get('/check-auth', jwtMiddleware, (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ status: 'success', message: 'User is authenticated' });
  } else {
    res.json({ status: 'error', message: 'User is not authenticated' });
  }
});

module.exports = router;
