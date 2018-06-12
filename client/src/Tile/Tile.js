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