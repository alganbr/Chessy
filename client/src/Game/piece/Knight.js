/*
  Knight component
  - represents a knight piece
  - the only logic here is to select the color of the piece
*/

import React from 'react';
import BlackKnight from '../../images/temp/black_knight.png';
import WhiteKnight from '../../images/temp/white_knight.png';

class Knight extends React.Component
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
      image = (<img src={WhiteKnight} alt="a knight"/>);
    }else
    {
      image = (<img src={BlackKnight} alt="a knight"/>);
    }
    return image;
  }
}

export default Knight;