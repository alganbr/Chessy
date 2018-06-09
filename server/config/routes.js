// Import controllers
const auth = require('../controllers/authController');
const user = require('../controllers/userController');

module.exports = app => {
  app.post('/login', auth.login);
  app.get('/users', user.index);
  app.post('/users', user.create);
};
