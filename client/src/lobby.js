import React from 'react';
import {initiateGame} from './socketer'
import InputForm from './inputForm'
import Game from './Game/Game'
import Waiting from './waitingScreen'

/*
  The Lobby component is essentially a branch, it either renders the:
    - inputForm component, when the user initially goes to the page
    - Game component, when the user has input a valid username and roomName 

*/

class Lobby extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      waitForGame: false,
      startGame: false,
      playerColor: '',
      username: '',
      roomName: '',
      validUserName: false,
      validRoomName: false,
    }

    this.handleNameInput = this.handleNameInput.bind(this)
    this.handleRoomInput = this.handleRoomInput.bind(this)
    this.handleJoinButton = this.handleJoinButton.bind(this)


  }

  handleNameInput(event){
    this.setState({username: event.target.value})
  }

  handleRoomInput(event){
    this.setState({roomName: event.target.value})
  }

  setGameFlags(wait, start,color){
    this.setState({
      startGame: start, 
      waitForGame: wait,
      playerColor: color,
    })
  }

  handleJoinButton(event){
    console.log('calling join')
    const username = this.state.username
    const roomName = this.state.roomName
    initiateGame(username, roomName, (wait, start, color) => this.setState({
      startGame: start, 
      waitForGame: wait,
      playerColor: color,
    }))

  }

  render(){
    let display = (
      <InputForm username={this.state.username} roomName={this.state.roomName} handleNameInput={this.handleNameInput} handleRoomInput={this.handleRoomInput} handleJoinButton={this.handleJoinButton}/>
    )
    if(this.state.startGame)
    {
      display = (<Game player={this.state.playerColor}/>)
    }else if(this.state.waitForGame){
      display = (<Waiting />)
    }

    return(
      <div>
        {display}
      </div>
    )
  }
}

export default Lobby

// <div className="centered-form__form">
//         <p>My username is: {this.state.username} and my room name is {this.state.roomName}</p>
//         <div className="form-field">
//           <h3>Join a Chat</h3>
//         </div>
//         <div className="form-field">
//           <label>Display name</label>
//           <input type="text" name="name" value={this.state.username} onChange={this.handleNameInput} autoFocus/>
//         </div>
//         <div className="form-field">
//           <label>Room name</label>
//           <input type="text" name="room" value={this.state.roomName} onChange={this.handleRoomInput}/>
//         </div>
//         <div className="form-field">
//           <button onClick={this.handleJoinButton}>Join</button>
//         </div>
//         {displayValue}
//       </div>