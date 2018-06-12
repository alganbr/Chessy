import io from 'socket.io-client'

const socket = io();

/*
  The socketer object handles all socket communication with the server. It has the following methods that could be called:
  - initiateGame(username, roomName, setGameFlag)
  
*/

socket.on('connect', () => {
  console.log('socket connection established')
})
/*
  - initiateGame(username, roomName, setGameFlag)
    - this method emits a 'join' event to join a room and start a new game, meant to be called from lobby.js to join a room (or start a game if the room already has another user in it)
    - username and roomName is passed in so that it can be relayed to the server where it will be validated and used to join a room if viable
    - setGameFlag is a function that accepts one argument that is the new value of the 'startGame' state in lobby.js
*/
const initiateGame = (username, roomName, setGameFlag) => {
  //handler on connection to server
  //if we successfully connected we want to join a room using the info we passed in the form
  socket.emit('join', {username, roomName}, (err) => {
    //callback function, accepts arguments from server
    if(err)
    {
      //if error was found we don't change the flag
      setGameFlag(false, false)
    }
  })
  socket.on('waitForOpponent', () => {
    setGameFlag(true, false)
  })
  socket.on('startGame', (params) => {
    if(params.white === username)
    setGameFlag(false, true)
  })
}



export {initiateGame}