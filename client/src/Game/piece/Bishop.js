/*
  Bishop component
  - represents a bishop piece
  - the only logic here is to select the color of the piece
*/

import React from 'react';
import BlackBishop from '../../images/temp/black_bishop.png';
import WhiteBishop from '../../images/temp/white_bishop.png';

class Bishop extends React.Component
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
      image = (<img src={WhiteBishop} alt="a bishop"/>);
    }else
    {
      image = (<img src={BlackBishop} alt="a bishop"/>);
    }
    return image;
  }
}

export default Bishop;