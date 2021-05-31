const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('./models/user');
require('dotenv').config();

passport.use(
  'sign-up',
  new LocalStrategy(
    { usernameField: 'username', passwordField: 'password' },
    async (username, password, done) => {
      try {
        const user = await User.create({ username, password });

        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async function (username, password, done) {
      try {
        const user = await User.findOne({ username });

        if (!user) {
          return done(null, false, { message: 'user not found' });
        }

        const validate = await user.isValidPassword(password);
        if (!validate) {
          return done(null, user, { message: 'wrong password' });
        }

        return done(null, user, { message: 'login successful' });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    },
    async function (token, done) {
      try {
        return done(null, token.user);
      } catch (err) {
        done(err);
      }
    }
  )
);

module.exports = passport;
