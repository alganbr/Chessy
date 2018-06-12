/*
	The basic building blocks of the chess board, represents a single tile in the board
	Note that value will contain a chess piece component which in turn will generate
	an image, thus how the chess piece images are rendered in the tiles.
*/

import React from 'react';
import './Tile.css';

const tile = (props) => {
  return(
    <button onClick={props.onClick} className={props.mcolor}>
      {props.value}
    </button>
    );
}

export default tile;