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
  
  /*
    handles join event from client
    - when? occurs when client sublimts the room form
    - what? we validate the user input, then attempt to add the user to the specified room. If the room has space the user is added, otherwise we dont do anything
  */
  socket.on('join', (params, callback) => {
    if (!isRealString(params.username) || !isRealString(params.roomName)) {
      return callback('Name and room name are required.');
    }

    //determine the number of participants in the room
    const roomParticipants = users.getUserList(params.roomName)

    //we only want a maximum of 2 participants in each room so we handle this
    if(roomParticipants.length <= 1)
    {
      //add the user to the room
      socket.join(params.roomName);
      //remove any user with same id from memory 
      users.removeUser(socket.id);
      //add the user to memory
      users.addUser(socket.id, params.username, params.roomName); 
    }else{
      return callback('The specified room has an ongoing game')
    }
    /*
      invoke callback, this causes client to set
      myUserName, myRoomName and setter in socketer.js
    */
    callback()

    
  })

  /*
    handles the ready event: 
    - when? a client is ready after the join event has been acknowledged, the client then sets the username, roomName and setter and emits the ready event
    - what? here we determine whether to make the user wait or start a game, the user waits when the opponent is not ready and we start a game when the room is full
  */
  socket.on('ready', () => {
    //At this point the room that corresponds to this user is ready to start a game
    //get the room name via socket id
    const roomName = users.getUser(socket.id).room
    const roomParticipants = users.getUserList(roomName)
    if(roomParticipants.length === 1)
    {
      socket.emit('waitForOpponent')
    }else if(roomParticipants.length === 2){
      console.log(`starting game on room ${roomName}`)
      const white = roomParticipants[0]
      const black = roomParticipants[1]
      io.to(roomName).emit('startGame', {white, black})
    }else{
      callback('room has more than 2 participants, unexpected behavior')
      console.log('room has more than 2 participants, unexpected behavior')
    }
  })

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id)
  })
})

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Server welcomes you' });
});

// Connect routes
require('./config/routes')(app);


server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});