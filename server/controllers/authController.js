const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

// POST /login
module.exports.login = (req, res) => {
  passport.authenticate('local', function(err, user, info) {
    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if (user) {
      const token = user.generateJwt();
      res.status(200);
      res.json({
        token: token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);
};
