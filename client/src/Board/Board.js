/*
  The purpose of this component is to simply render the board based on the configuration
  of the tiles props (which is inherited from Game.js)
  Might want to convert this component to a functional one due to the lack of logic and states
*/

import React from 'react';
import Tile from '../Tile/Tile';
import './Board.css';

class Board extends React.Component{
  /*
    this function renders a tile object:
    1. myColor is retrieved from our props.tiles in the color property
    2. myValue is retrieved from our props.tiles which is passed from Game component. 
       The purpose is to render our piece image if a piece is in the current tile
  */
  renderSquare(row, col){
    const myColor = this.props.tiles[row][col].color;
    const myValue = this.props.tiles[row][col].component;
    return(
      <Tile value={myValue} mcolor={myColor} onClick={() => this.props.onClick(row,col)}/>
      );
  }

  //the below block maps the renderSquare function to each tile in the tiles props from Game.js
  render(){
    let m_board = (
      <div>
        {
          this.props.tiles.map(
            (row, rowIndex) => {
              return(
                <div className="board-row">
                  {
                    row.map(
                      (value, colIndex) => {
                        return this.renderSquare(rowIndex, colIndex);
                      }
                    )
                  }
                </div>
                )
            }
          )
        }
      </div>
      )
    return m_board;
  }
}

export default Board;