const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.signup = [
  body('username').trim().isLength({ min: 4 }).escape(),
  body('password', 'not a valid password').exists(),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("that ain't it");
    }

    return true;
  }),

  (req, res, next) => {
    const errors = validationResult(req);

    bcrypt.hash(req.body.password, 10, (err, hashed) => {
      let user = new User({
        username: req.body.username,
        password: hashed,
      });

      if (!errors.isEmpty()) {
        res.sendStatus(418);
        return;
      } else {
        user.save((err) => {
          if (err) {
            return next(err);
          }
          res.redirect('/login');
        });
      }
    });
  },
];

exports.login = (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: 'something wrong is not right',
        user: req.user,
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        return res.send(err);
      }

      const token = jwt.sign(user, process.env.SECRET);
      return res.json({ user: token });
    });
  })(req, res);
};

exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/');
};
