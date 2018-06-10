// Import controllers
const auth = require('../controllers/authController');
const user = require('../controllers/userController');
const cors = require('cors');

module.exports = app => {
  app.post('/login', auth.login);
  app.get('/users', cors(), user.index);
  app.post('/users', user.create);
};
