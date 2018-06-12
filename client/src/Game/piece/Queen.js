/*
  Queen component
  - represents a queen piece
  - the only logic here is to select the color of the piece
*/

import React from 'react';
import BlackQueen from '../../images/temp/black_queen.png';
import WhiteQueen from '../../images/temp/white_queen.png';

class Queen extends React.Component
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
      image = (<img src={WhiteQueen} alt="a queen"/>);
    }else
    {
      image = (<img src={BlackQueen} alt="a queen"/>);
    }
    return image;
  }
}

export default Queen;