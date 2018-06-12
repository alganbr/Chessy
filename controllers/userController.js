const mongoose = require('mongoose');
const User = mongoose.model('User');

// GET /users
module.exports.index = (req, res) => {
  User.find(req.query, (err, users) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.send(users);
  });
};

// POST /users
module.exports.create = (req, res) => {
  var user = new User();
  user.email = req.body.email;
  user.name = req.body.name;
  user.setPassword(req.body.password);
  user.save((err, user) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.send(user);
  });
};
