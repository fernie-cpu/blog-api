const passport = require('passport');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
require('dotenv').config();

exports.signup = [
  body('username')
    .trim()
    .isLength({ min: 4 })
    .escape()
    .custom(async (username) => {
      try {
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
          throw new Error('username already exists');
        }
      } catch (err) {
        throw new Error(err);
      }
    }),
  body('password', 'not a valid password').exists(),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("that ain't it");
    }

    return true;
  }),

  async (req, res, next) => {
    passport.authenticate('sign-up', { session: false }, (err, user, info) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json({
          username: req.body.username,
          errors: errors.array(),
        });
      }
      if (err) {
        return next(err);
      }
      res.json({
        message: 'Signup successful',
        user: req.user,
      });
    })(req, res, next);
  },
];

exports.login = async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error('An error occurred.');

        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, username: user.username };
        const token = jwt.sign({ user: body }, process.env.SECRET);

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/');
};
