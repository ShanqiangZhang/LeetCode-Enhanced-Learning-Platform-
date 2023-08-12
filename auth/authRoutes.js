const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.cookie('token', req.user.jwt);
    //用jwt来管理会话试试
    // req.session.user = req.user;
    res.redirect('/');
  }
);

module.exports = router;
