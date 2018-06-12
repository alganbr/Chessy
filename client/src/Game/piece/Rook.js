/*
  Rook component
  - represents a rook piece
  - the only logic here is to select the color of the piece
*/

import React from 'react';
import BlackRook from '../../images/temp/black_rook.png';
import WhiteRook from '../../images/temp/white_rook.png';

class Rook extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      m_color: props.mcolor,
    }
  }

  render()
  {
    const color = this.props.m_color;
    let image;
    if(color === "white")
    {
      image = (<img src={WhiteRook} alt="a rook"/>);
    }else
    {
      image = (<img src={BlackRook} alt="a rook"/>);
    }
    return image;
  }
}

export default Rook;