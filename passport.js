const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    function (email, password, cb) {
      return UserModel.findOne({ email, password })
        .then((user) => {
          if (!user) {
            return cb(null, false, { message: 'incorrect email or password' });
          }

          return cb(null, user, { message: 'logged in successfully' });
        })
        .catch((err) => cb(err));
    }
  )
);

module.exports = passport;
