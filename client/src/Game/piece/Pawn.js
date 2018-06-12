/*
  Pawn component
  - represents a pawn piece
  - the only logic here is to select the color of the piece
*/

import React from 'react';
import WhitePawn from '../../images/temp/white_pawn.png';
import BlackPawn from '../../images/temp/black_pawn.png';

//need to implement double steps
class Pawn extends React.Component
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
      image = (<img src={WhitePawn} alt="a pawn"/>);
    }else
    {
      image = (<img src={BlackPawn} alt="a pawn"/>);
    }
    return image;
  }
}

export default Pawn;