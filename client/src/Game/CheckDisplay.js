/*
  This component will display a 'check' to the player when he/she is checked
*/

import React from 'react'

const checkDisplay = (props) => {
  let content = null;
  if(props.playerCheck)
  {
    content = (<p>CHECK</p>);
  }
  
  return content;
}

export default checkDisplay;