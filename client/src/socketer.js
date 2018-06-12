import io from 'socket.io-client'

const socket = io();

/*
  The socketer object handles all socket communication with the server. It has the following methods that could be called:
  - initiateGame(username, roomName, setGameFlag)
  
*/

//global variables to store client information
//consider moving to a separate file once more data is stored
let myUserName
let myRoomName
let setter //wait, start, color

socket.on('connect', () => {
  console.log('socket connection established')
})

socket.on('waitForOpponent', () => {
  console.log('waiting for opponent') 
  setter(true, false)
})

socket.on('startGame', (params) => {
  console.log('starting game')
  if(params.white === myUserName){
    setter(false, true, 'white')
    console.log('player is white')
  }
  else{
    setter(false, true, 'black')
    console.log('player is black')
  }
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
      console.log('error found when joining', err)
      setGameFlag(false, false)
    }else{
      myUserName = username
      myRoomName = roomName
      setter = setGameFlag
      socket.emit('ready')
    }
  })
  
}



export {initiateGame}