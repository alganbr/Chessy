const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    (username, password, done) => {
      User.findOne({ email: username }, (err, user) => {
        // Handle error
        if (err) {
          return done(err);
        }

        // User not found
        if (!user) {
          return done(null, false, {
            message: 'User not found'
          });
        }

        // Invalid password
        if (!user.validPassword(password)) {
          return done(null, false, {
            message: 'Username and password do not match'
          });
        }

        return done(null, user);
      });
    }
  )
);
