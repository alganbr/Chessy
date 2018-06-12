/*
  A container to hold captured pieces
  Unfinished, need to implement:
  - separate for each player
*/

import React from 'react';

const capturedPieces = (props) => {
  return(
    <div>
      {props.captured}
    </div>
  );
}

export default capturedPieces;

