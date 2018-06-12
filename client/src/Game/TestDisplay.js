import React from 'react';
import './TestDisplay.css';

const printPieceSet = (pieceSet) =>
  {
    return(
      <div>
        <ul className="test">
          <li >pawn0: [{pieceSet["pawn0"][0]}, {pieceSet["pawn0"][1]}]</li>
          <li >pawn1: [{pieceSet["pawn1"][0]}, {pieceSet["pawn1"][1]}]</li>
          <li >pawn2: [{pieceSet["pawn2"][0]}, {pieceSet["pawn2"][1]}]</li>
          <li >pawn3: [{pieceSet["pawn3"][0]}, {pieceSet["pawn3"][1]}]</li>
          <li >pawn4: [{pieceSet["pawn4"][0]}, {pieceSet["pawn4"][1]}]</li>
          <li >pawn5: [{pieceSet["pawn5"][0]}, {pieceSet["pawn5"][1]}]</li>
          <li >pawn6: [{pieceSet["pawn6"][0]}, {pieceSet["pawn6"][1]}]</li>
          <li >pawn7: [{pieceSet["pawn7"][0]}, {pieceSet["pawn7"][1]}]</li>
        </ul>
        <ul className = "test">
          <li >rook0: [{pieceSet["rook0"][0]}, {pieceSet["rook0"][1]}]</li>
          <li >rook1: [{pieceSet["rook1"][0]}, {pieceSet["rook1"][1]}]</li>
          <li >knight0: [{pieceSet["knight0"][0]}, {pieceSet["knight0"][1]}]</li>
          <li >knight1: [{pieceSet["knight1"][0]}, {pieceSet["knight1"][1]}]</li>
          <li >bishop0: [{pieceSet["bishop0"][0]}, {pieceSet["bishop0"][1]}]</li>
          <li >bishop1: [{pieceSet["bishop1"][0]}, {pieceSet["bishop1"][1]}]</li>
          <li >queen: [{pieceSet["queen"][0]}, {pieceSet["queen"][1]}]</li>
          <li >king: [{pieceSet["king"][0]}, {pieceSet["king"][1]}]</li>
        </ul>
      </div>
      )
  }

const testDisplay = (props) => {
  return(
    <div className="test">
      <p>current: {props.player} {props.piece} </p>
      <div className="test"><p>player piece set:</p>
          {printPieceSet(props.playerPieces)}
      </div>
      <div className="test"><p>opponent piece set:</p> 
          {printPieceSet(props.opponentPieces)}
      </div>
    </div>
  );
}

export default testDisplay;