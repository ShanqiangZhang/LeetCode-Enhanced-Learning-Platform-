const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');

dotenv.config({ path: './config.env' });

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/v1/auth/google/callback'
    },
    async (token, tokenSecret, profile, done) => {
      try {
        const user = await User.findOne({ googleId: profile.id });

        if (user) return done(null, user);

        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value
        });
        await newUser.save();

        const jwtToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
          expiresIn: '60d'
        });
        newUser.jwt = jwtToken;

        return done(null, newUser);
      } catch (err) {
        // 如果有任何错误，记录它并通过 done 回调传递
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
