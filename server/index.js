const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require("body-parser");
const keys = require('./config/keys');

require('./models/user');
require('./config/passport');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Connect routes
require('./config/routes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);