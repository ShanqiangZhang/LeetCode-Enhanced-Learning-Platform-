/* eslint-disable camelcase */
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');
const URLconfig = require('../config/URLConfig');

// const { backend_url } = process.env;
// const { forntend_url } = process.env;
// const callbackURL = `${backend_url}/v1/auth/google/callback`;
// console.log(URLconfig.backend_url);
const callbackURL = `${URLconfig.backend_url}/v1/auth/google/callback`;
// const callbackURL = `http://localhost:3001/v1/auth/google/callback`;

console.log(callbackURL);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL
      //上线后的回调函数?
      // callbackURL: `/v1/auth/google/callback`
    },
    async (token, tokenSecret, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        console.log(user ? 'user found' : 'not found user');

        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value
          });
          await user.save();
        }
        // console.log(user);
        // 为这个用户生成一个JWT
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: '360d'
        });
        // 不需要在数据库中保存jwt，但我们可以将它添加到用户对象上，这样我们可以在回调中访问它
        user.jwt = jwtToken;
        console.log(user.jwt);
        return done(null, user);
      } catch (err) {
        console.log('Error:', err);
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
