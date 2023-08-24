/* eslint-disable camelcase */
const express = require('express');
const passport = require('passport');
// const jwt = require('jsonwebtoken');
// const User = require('../models/UserSchema');
const jwtMiddleware = require('../middlewares/authMiddleware');
const URLconfig = require('../config/URLConfig');

const router = express.Router();
// const { frontend_url } = process.env;

// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google', (req, res, next) => {
  console.log('Attempting Google Authentication');
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  console.log('/google/callback executed');
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
      //cookie的默认domain是localhost不是 上线前端
      // res.cookie('token', user.jwt);
      //上线前端
      // res.cookie('token', user.jwt, { domain: '.leetcode-cards.com' });
      // res.cookie('token', user.jwt);

      res.cookie('token', user.jwt, { domain: URLconfig.domain, path: '/', secure: false });
      // console.log(domain);
      // res.cookie('token', user.jwt, { domain });
      // console.log('cookie', res.cookie);
      // console.log('execute: google/callback + url', frontend_url);
      return res.redirect(`${URLconfig.frontend_url}`);
    });
  })(req, res, next);
});

router.get('/verify', jwtMiddleware, (req, res) => {
  console.log('verify function executed');
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
