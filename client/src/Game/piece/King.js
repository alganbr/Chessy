/*
  King component
  - represents a king piece
  - the only logic here is to select the color of the piece
*/

import React from 'react';
import BlackKing from '../../images/temp/black_king.png';
import WhiteKing from '../../images/temp/white_king.png';

class King extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      m_color: props.player,
    }
  }

  render()
  {
    const color = this.props.m_color;
    let image;
    if(color === "white")
    {
      image = (<img src={WhiteKing} alt="a king"/>);
    }else
    {
      image = (<img src={BlackKing} alt="a king"/>);
    }
    return image;
  }
}

export default King;