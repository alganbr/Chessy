import React from 'react'

const turnIndicator = (props) => {
  let display = null;
  if(props.playerTurn)
  {
    display = (<p>Player's turn</p>);
  } else
  {
    display = (<p>Opponent's turn</p>);
  }
  return display;
}

export default turnIndicator;