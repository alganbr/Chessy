import React, {Component} from 'react'

/*
  This component simply takes user input
  - username
  - roomName
  It has the following props
  - username (not necessary)
  - roomName (not necessary)
  - handleNameInput
  - handleRoomInput
  - handleJoinButton
  The main purpose of this component is to set the state of the lobby component to true via the handleJoinButton prop. 
  This occurs when the user has entered a valid username and roomName.
  The check for the validity of these two fields occur in the server via a 'join' event that is emitted by handleJoinButton.
  Refer to this function in lobby.js for more details
*/

const InputForm = (props) => {
  return (
    <div className="centered-form__form">
      <p>My username is: {props.username} and my room name is {props.roomName}</p>
      <div className="form-field">
        <h3>Join a Chat</h3>
      </div>
      <div className="form-field">
        <label>Display name</label>
        <input type="text" name="name" value={props.username} onChange={props.handleNameInput} autoFocus/>
      </div>
      <div className="form-field">
        <label>Room name</label>
        <input type="text" name="room" value={props.roomName} onChange={props.handleRoomInput}/>
      </div>
      <div className="form-field">
        <button onClick={props.handleJoinButton}>Join</button>
      </div>
    </div>
  )
}

export default InputForm

