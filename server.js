const express = require('express');
const cors = require('cors');
const http = require('http')
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require("body-parser");
const keys = require('./config/keys');
const socketIO = require('socket.io')
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users');

require('./models/user');
require('./config/passport');

mongoose.connect(keys.mongoURI);

const app = express();
const PORT = process.env.PORT || 5000;

//socket io variables
const server =  http.createServer(app);
const io = socketIO(server)

//store active users in memory
let users = new Users()

//socket io behavior for each connected socket
io.on('connection', (socket) => {
  console.log('successfuly connected to a client')
  socket.on('join', (params, callback) => {
    if (!isRealString(params.username) || !isRealString(params.roomName)) {
      return callback('Name and room name are required.');
    }

    //determine the number of participants in the room
    const numPar = users.getUserList(params.roomName)
    if(numPar.length <= 1)
    {
      socket.join(params.room); 
      users.removeUser(socket.id);
      users.addUser(socket.id, params.name, params.room); 
      callback()
    }else{
      return callback('The specified room has an ongoing game')
    }

    //At this point the room that corresponds to this user is ready to start a game
    //socket.emit('startGame', {})
    
  })

})

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

// Connect routes
require('./config/routes')(app);


server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});