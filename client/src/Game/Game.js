import React from 'react';
import Board from '../Board/Board';
import Pawn from './piece/Pawn';
import Rook from './piece/Rook';
import Knight from './piece/Knight';
import Bishop from './piece/Bishop';
import King from './piece/King';
import Queen from './piece/Queen';
import CapturedPieces from './amenities/CapturedPieces';
import TurnIndicator from './amenities/TurnIndicator';
import CheckDisplay from './amenities/CheckDisplay';
import TestDisplay from './amenities/TestDisplay';
import CoverGenerator from './utils/CoverGenerator';
import io from 'socket.io-client'

const socket = io();

class Game extends React.Component{
  constructor(props){
    super(props);

    //set the player color
    const player = props.player;
    const opponent = (player === 'white') ? 'black' : 'white';
    //construct the initial board configuration
    let initial = [];
    //boolean to create alternating tile colors
    let isBlack = false;

    //construct the initial board
    
    //In this for loop, we create an empty board
    //this for loop creates a row each iteration
    for(let i = 0; i < 8; i++)
    {
      //this inner loop creates a tile each iteration
      let curr_row = [];
      for(let l = 0; l < 8; l++)
      {
        let curr_square = "black square";
        if(!isBlack)
            curr_square = "white square";
        curr_row = [...curr_row, {color: curr_square, component:null, value: null, initColor: curr_square}];
        isBlack = !isBlack; 
      }
      initial = [...initial, curr_row];
      isBlack = !isBlack;
    }

    const playerPieceComponents = {  pawn: (<Pawn m_color={player} />) , 
                                    rook: (<Rook m_color={player} />), 
                                    knight:(<Knight m_color={player} />), 
                                    bishop: (<Bishop m_color={player} />), 
                                    queen: (<Queen m_color={player}/>), 
                                    king:(<King m_color={player}/>)}
    const opponentPieceComponents = {pawn: (<Pawn m_color={opponent} />), 
                                    rook:(<Rook m_color={opponent} />), 
                                    knight: (<Knight m_color={opponent} />), 
                                    bishop: (<Bishop m_color={opponent} />), 
                                    queen: (<Queen m_color={opponent}/>), 
                                    king: (<King m_color={opponent}/>)}

    //initialize the pawns in the board
    for(let j = 0; j < 8; j++)
    {
      const pawnID = "pawn" + j;
      initial[6][j] = {...initial[6][j], value:{piece: "pawn", color:player, ID: pawnID} ,component: playerPieceComponents.pawn};
       initial[1][j] = {...initial[1][j], value:{piece: "pawn", color:opponent, ID:pawnID} ,component: opponentPieceComponents.pawn};
    }

    //initalize the other pieces for the player
    //initialize rooks
    initial[7][0] =  {...initial[7][0], 
      value: {piece: "rook", color: player, ID:"rook0"}, component:playerPieceComponents.rook};
    initial[7][7] =  {...initial[7][7], 
      value: {piece:"rook", color: player, ID:"rook1"},component: playerPieceComponents.rook};
    //initialize knights
    initial[7][1] = {...initial[7][1],
      value: {piece:"knight", color: player, ID:"knight0"}, component: playerPieceComponents.knight};
    initial[7][6] = {...initial[7][6],
      value: {piece: "knight", color: player, ID:"knight1"}, component: playerPieceComponents.knight};
    //initialize bishops
    initial[7][2] = {...initial[7][2],
      value: {piece: "bishop", color: player, ID:"bishop0"}, component: playerPieceComponents.bishop};
    initial[7][5] = {...initial[7][5],
      value: {piece: "bishop", color: player, ID:"bishop1"}, component: playerPieceComponents.bishop};

    //initialize the other pieces for the opponent
    initial[0][0] =  {...initial[0][0], 
      value: {piece: "rook", color: opponent, ID:"rook0"}, component: opponentPieceComponents.rook};
    initial[0][7] =  {...initial[0][7], 
      value: {piece: "rook", color: opponent, ID:"rook1"}, component: opponentPieceComponents.rook};
    //initialize knights
    initial[0][1] = {...initial[0][1],
      value: {piece: "knight", color: opponent, ID:"knight0"}, component: opponentPieceComponents.knight};
    initial[0][6] = {...initial[0][6],
      value: {piece: "knight", color: opponent, ID:"knight1"}, component: opponentPieceComponents.knight};
    //initialize bishops
    initial[0][2] = {...initial[0][2],
      value: {piece: "bishop", color: opponent, ID:"bishop0"}, component: opponentPieceComponents.bishop};
    initial[0][5] = {...initial[0][5],
      value: {piece: "bishop", color: opponent, ID:"bishop1"}, component: opponentPieceComponents.bishop};
    let playerQueen;
    let opponentQueen;
    let playerKing;
    let opponentKing;
    if(player === "white")
    {
      //initialize opponent king and queen
      initial[0][3] = {...initial[0][3],
        value: {piece: "queen", color:opponent, ID:"queen"}, component: opponentPieceComponents.queen};
      initial[0][4] = {...initial[0][4],
        value: {piece: "king", color:opponent, ID:"king" }, component: opponentPieceComponents.king};

      //initialize player king and queen
      initial[7][3] = {...initial[7][3],
        value: {piece:"queen",color: player, ID:"queen"}, component: playerPieceComponents.queen};
      initial[7][4] = {...initial[7][4],
        value: {piece: "king", color: player, ID:"king"}, component: playerPieceComponents.king};
      playerKing = [7,4];
      opponentKing = [0,4];  
      playerQueen = [7,3];
      opponentQueen = [0,3];    
    }else{
      //initalize opponent king and queen
      initial[0][3] = {...initial[0][3],
        value:{piece: "king", color: opponent, ID:"king"}, component: opponentPieceComponents.king};
      initial[0][4] = {...initial[0][4],
        value: {piece: "queen", color: opponent, ID:"queen"}, component: opponentPieceComponents.queen};

      //initialize player king and queen
      initial[7][3] = {...initial[7][3],
        value:{piece:"king", color: player, ID:"king"}, component: playerPieceComponents.king};
      initial[7][4] = {...initial[7][4],
        value: {piece:"queen", color: player, ID:"queen"}, component: playerPieceComponents.queen};
      playerKing = [7,3];
      opponentKing = [0,3];
      playerQueen = [7,4];
      opponentQueen = [0,4];
    }

    //initialize the variables that contain the coordinates of each piece for both players
    let playerPieces = {rook0:[7,0], rook1:[7,7], knight0: [7,1], knight1:[7,6], bishop0:[7,2], bishop1: [7,5], queen: playerQueen, king:playerKing};
    let opponentPieces = {rook0:[0,0], rook1:[0,7], knight0:[0,1], knight1: [0,6], bishop0:[0,2], bishop1:[0,5], queen: opponentQueen, king:opponentKing};
    let playerPiecesCover = {rook0:[], rook1:[], knight0: [[5,0],[5,2]], knight1:[[5,5],[5,7]], bishop0:[], bishop1: [], queen: [], king:[]};
    let opponentPiecesCover = {rook0:[], rook1:[], knight0: [[2,0], [2,2]], knight1:[[2,5],[2,7]], bishop0:[], bishop1: [], queen: [], king:[]};
    for(let i = 0; i < 8; i++)
    {
      playerPieces["pawn" + i] = [6,i];
      opponentPieces["pawn" + i] = [1,i];
      playerPiecesCover["pawn" + i] = [[5,i],[4,i]];
      opponentPiecesCover["pawn"+i] = [[2,i],[3,i]];      
    }

    let coverGen = new CoverGenerator(player);


    this.state = {
      history:[
      {tiles: initial}
      ],
      stepNumber: 0,
      playerIsNext: true,
      player: player,
      opponent: opponent,
      rank: 8,
      current: null,
      playerCapturedPieces: [],
      opponentCapturedPieces: [],
      playerPieces: playerPieces,
      opponentPieces: opponentPieces,
      highlightedTiles: [],
      coverGen: coverGen,
      playerPiecesCover: playerPiecesCover,
      opponentPiecesCover: opponentPiecesCover,
      checkMate: false,
      playerChecked: false,
      opponentChecked: false,
      playerKingMoved: false,
      opponentKingMoved: false,
      playerRook0Moved: false,
      playerRook1Moved: false,
      opponentRook0Moved: false,
      opponentRook1Moved: false,
      myIDs: ["pawn0", "pawn1", "pawn2", "pawn3", "pawn4", "pawn5", "pawn6", "pawn7", "rook0", "rook1", "knight0", "knight1", "bishop0", "bishop1", "queen", "king"],
      playerPieceComponents: playerPieceComponents,
      opponentPieceComponents: opponentPieceComponents,
     
    };
    
  }

  //this method searches array for value and returns true if value is found in array
  searchArray(array, value)
  {
    const temp = [...array];
    let result = temp.find((coord) => JSON.stringify(coord) === JSON.stringify(value));
    if(typeof(result) === "undefined")
    {
      //the value was not found
      return false;
    }else
    {
      return true;
    }
  }

  //this method generates the cover for a piece given its row , col, color and ID based on given board configuration (tiles)
  generateCoverByID(row, col, color, tiles, ID)
  {
    let cover;
    if(row > 7 || row < 0 || col > 7 || col < 0)
    {
      return [];
    }
    switch(ID){
      case "pawn0":
      case "pawn1":
      case "pawn2":
      case "pawn3":
      case "pawn4":
      case "pawn5":
      case "pawn6":
      case "pawn7":
        cover = this.state.coverGen.generatePawnCover(row, col, color, tiles);
        break;
      case "rook0":
      case "rook1":
        cover = this.state.coverGen.generateRookCover(row, col, color, tiles);
        break;
      case "knight0":
      case "knight1":
        cover = this.state.coverGen.generateKnightCover(row, col, color, tiles);
        break;
      case "bishop0":
      case "bishop1":
        cover = this.state.coverGen.generateBishopCover(row, col, color, tiles);
        break;
      case "queen":
        cover = this.state.coverGen.generateQueenCover(row, col, color, tiles);
        break;
      case "king":
        //for king we need to handle castling, we do not handle this in the coverGenerator since it requires knowledge of the board
        cover = this.state.coverGen.generateKingCover(row, col, color, tiles).concat(this.handleCastling(color, tiles));
        break;
      default:
    }
    return cover;
  }

  //this method generates the total cover of all the pieces of a player given the player's color, pieceSet and a board configuration
  generateCurrentCover(tiles, pieceSet, color)
  {
    let returnArray = [];
    const myIDs = this.state.myIDs;
    for(let i = 0; i < myIDs.length; i++)
    {
      const currPieceCoord = pieceSet[myIDs[i]];
      const curr_cover = this.generateCoverByID(currPieceCoord[0], currPieceCoord[1], color, tiles, myIDs[i]);
      returnArray = returnArray.concat(curr_cover);
    }

    return returnArray;
  }

  
  getMergeCover(color)
  {
    let initialCover;
    let mergedCover = [];
    if(color === this.state.player)
    {
      initialCover = {...this.state.playerPiecesCover};
    }else{
      initialCover = {...this.state.opponentPiecesCover};
    }

    const myIDs = [...this.state.myIDs];
    for(let i = 0; i < myIDs.length; i++)
    {
      mergedCover = mergedCover.concat(initialCover[myIDs[i]]);
    }

    return mergedCover;
  }


  handleCastling(color, tiles)
  {
    let result = [];

    let pieces;
    let kingPosition;
    let rook0Position;
    let rook1Position;
    let rook0Path;
    let rook1Path;
    let kingMoved;
    let rook0Moved;
    let rook1Moved;
    let checked;
    let clearPath0 = true;
    let clearPath1 = true;
    let rowIndex;
    let oppCover;
    if(color === this.state.player)
    {
      pieces = {...this.state.playerPieces};
      rowIndex = 7;
      kingMoved = this.state.playerKingMoved;
      rook0Moved = this.state.playerRook0Moved;
      rook1Moved = this.state.playerRook1Moved;
      checked = this.state.playerChecked;
      oppCover = this.getMergeCover(this.state.opponent);
    }else{
      pieces = {...this.state.opponentPieces};
      rowIndex = 0;
      kingMoved = this.state.opponentKingMoved;
      rook0Moved = this.state.opponentRook0Moved;
      rook1Moved = this.state.opponentRook1Moved;
      checked = this.state.opponentChecked;
      oppCover = this.getMergeCover(this.state.player);
    }
    rook0Path = [[rowIndex,1],[rowIndex,2],[rowIndex,3]];
    rook1Path = [[rowIndex,5],[rowIndex,6]];
    kingPosition = pieces["king"];
    rook0Position = pieces["rook0"];
    rook1Position = pieces["rook1"];

    //check if the path is clear
    for(let i = 0; i < rook0Path.length; i++)
    {
      if(tiles[rook0Path[i][0]][rook0Path[i][1]].value != null)
      {
        clearPath0 = false;
        break;
      }
      if(this.searchArray(oppCover,rook0Path[i]))
      {
        clearPath0 = false;
        break;
      }
    }

    for(let j = 0; j < rook1Path.length; j++)
    {
      if(tiles[rook1Path[j][0]][rook1Path[j][1]].value != null)
      {
        clearPath1 = false;
        break;
      }
      if(this.searchArray(oppCover,rook1Path[j]))
      {
        clearPath1 = false;
        break;
      }
    }

    //first handle the rook0 castling
    
    if(!checked && !kingMoved)
    {
      //add to the return array
      if(!rook0Moved && clearPath0)
      {
        result =[...result, [rowIndex, 2]];  
      }
      if(!rook1Moved && clearPath1)
      {
        result = [...result, [rowIndex, 6]];
      }
    }
    return result;

  }

  //the main algorithm for the program to control complex restrictions relating to king checks
  //current: the considered piece
  //curr_cover: the cover of the considered piece
  //board: the configuration of the board to be tested for
  //this method essentially tests all the possible moves of current (based on curr_cover) and filters the legal moves
  boardTest(board, curr_cover, current)
  {
    let returnArray = [];
    let pieceSet;
    let turnOpponent;

    //we initialize the proper piece set to generate the cover
    if(current.data.value.color === this.state.player)
    {
      //it is the player's turn so we want to generate cover for opponent
      const temp = this.state.opponentPieces;
      pieceSet = {pawn0: temp.pawn0, pawn1: temp.pawn1, pawn2: temp.pawn2, pawn3: temp.pawn3, pawn4: temp.pawn4, pawn5: temp.pawn5, pawn6:temp.pawn6, pawn7: temp.pawn7, rook0: temp.rook0, rook1: temp.rook1, knight0: temp.knight0, knight1: temp.knight1, bishop0: temp.bishop0, bishop1: temp.bishop1, queen: temp.queen, king: temp.king};
      turnOpponent = this.state.opponent;
    }else
    {
      //it is the opponent's turn so we want to generate cover for player
      const temp = this.state.playerPieces;
      pieceSet = {pawn0: temp.pawn0, pawn1: temp.pawn1, pawn2: temp.pawn2, pawn3: temp.pawn3, pawn4: temp.pawn4, pawn5: temp.pawn5, pawn6:temp.pawn6, pawn7: temp.pawn7, rook0: temp.rook0, rook1: temp.rook1, knight0: temp.knight0, knight1: temp.knight1, bishop0: temp.bishop0, bishop1: temp.bishop1, queen: temp.queen, king: temp.king};
      turnOpponent = this.state.player;
    }


    //we try each move that the selected piece can do and check to see if it will result in a check
    //console.log("attempting to move " + current.data.value.color + " " + current.data.value.ID);
    for(let i = 0; i < curr_cover.length; i++)
    {
      const currentMove = curr_cover[i];
      //console.log("currently testing for move to " + "[" + currentMove[0] + "," + currentMove[1] + "]");
      
      //below we generate the tile to test from, we need to do this since JavaScript uses pointers for object reference
      let tiles = [];
      for(let j = 0; j < board.length; j++)
      {
        let curr_row = [];
        for(let k = 0; k < board[j].length; k++)
        {
          const tempTile = {color: board[j][k].color, component:board[j][k].component, value: board[j][k].value, initColor: board[j][k].initColor};
          curr_row = [...curr_row, tempTile];
        }
        tiles = [...tiles, curr_row];
      }

      //here we reconfigure the tile based on the current move
      if(tiles[currentMove[0]][currentMove[1]].value === null)
      {
        //modify the tiles variable according to the move
        tiles[currentMove[0]][currentMove[1]] = {...tiles[currentMove[0]][currentMove[1]], value:current.data.value, component: current.data.component};
        tiles[current.row][current.col] = {...tiles[current.row][current.col], value: null, component: null};
      }else if(tiles[currentMove[0]][currentMove[1]].value.color != current.data.value.color)
      {
          //A capture scenario
          //we need to remove the captured piece from the piece set
          pieceSet[tiles[currentMove[0]][currentMove[1]].value.ID] = [-1,-1];
          //modify the tiles variable according to the move
          tiles[currentMove[0]][currentMove[1]] = {...tiles[currentMove[0]][currentMove[1]], value:current.data.value, component: current.data.component};
          tiles[current.row][current.col] = {...tiles[current.row][current.col], value: null, component: null};
      }
      //here we generate the cover of all the opponent's piece and concatenate them together to result based of the newly configured tiles
      const result = this.generateCurrentCover(tiles, pieceSet, turnOpponent);
      //console.log("here is the opponent's cover after the move was made ");
      //console.log(result);
      
      let kingCoord = null;
      if(current.data.value.color === this.state.player)
      {
        if(current.data.value.ID === "king")
        {
          kingCoord = currentMove;
        }else
        {
          kingCoord = this.state.playerPieces.king;  
        }
      }else{
        if(current.data.value.ID === "king")
        {
          kingCoord = currentMove;
        }else
        {
          kingCoord = this.state.opponentPieces.king;  
        }
      }
      
      if(!this.searchArray(result, kingCoord))
      {
        returnArray = [...returnArray, currentMove];
      }else
      {
        console.log("we have a check scenario from moving " + current.data.value.ID + " to [" + currentMove[0] + "," + currentMove[1] + "]");
      }
      //we reset the proper piece set to generate the cover
      if(current.data.value.color === this.state.player)
      {
        //it is the player's turn so we want to generate cover for opponent
        const temp = this.state.opponentPieces;
        pieceSet = {pawn0: temp.pawn0, pawn1: temp.pawn1, pawn2: temp.pawn2, pawn3: temp.pawn3, pawn4: temp.pawn4, pawn5: temp.pawn5, pawn6:temp.pawn6, pawn7: temp.pawn7, rook0: temp.rook0, rook1: temp.rook1, knight0: temp.knight0, knight1: temp.knight1, bishop0: temp.bishop0, bishop1: temp.bishop1, queen: temp.queen, king: temp.king};
        turnOpponent = this.state.opponent;
      }else
      {
        //it is the opponent's turn so we want to generate cover for player
        const temp = this.state.playerPieces;
        pieceSet = {pawn0: temp.pawn0, pawn1: temp.pawn1, pawn2: temp.pawn2, pawn3: temp.pawn3, pawn4: temp.pawn4, pawn5: temp.pawn5, pawn6:temp.pawn6, pawn7: temp.pawn7, rook0: temp.rook0, rook1: temp.rook1, knight0: temp.knight0, knight1: temp.knight1, bishop0: temp.bishop0, bishop1: temp.bishop1, queen: temp.queen, king: temp.king};
        turnOpponent = this.state.player;
      }
    }
    return returnArray;
  }

  generateAbsoluteCover(tiles, color)
  {
    //the set of pieces for which we test each possible moves for
    let pieceSet;
    let pieceSetCover;
    if(color === this.state.player)
    {
      pieceSet = {...this.state.playerPieces};
      pieceSetCover = {...this.state.playerPiecesCover};
    }else{
      pieceSet = {...this.state.opponentPieces};
      pieceSetCover = {...this.state.opponentPiecesCover};
    }

    const myIDs = this.state.myIDs;
    for(let i = 0; i < myIDs.length; i++){
      const currentID = myIDs[i];
      const currentCoord = pieceSet[currentID];
      if(currentCoord[0] === -1 || currentCoord[1] === -1)
      {
        pieceSetCover[currentID] = [];
        continue;
      }
      const currentUnfilteredCover = this.generateCoverByID(currentCoord[0], currentCoord[1], color, tiles, currentID);
      const currentFilteredCover = this.boardTest(tiles, currentUnfilteredCover, {data:tiles[currentCoord[0]][currentCoord[1]], row:currentCoord[0], col:currentCoord[1]});
      pieceSetCover[currentID] = currentFilteredCover;
    }

    return pieceSetCover;
  }

  testCheck(color, pcover)
  {
    let kingLocation;
    if(color === this.state.player)
    {
      kingLocation = this.state.playerPieces["king"];
    }else
    {
      kingLocation = this.state.opponentPieces["king"];
    }
    
    const myIDs = this.state.myIDs;
    for(let i = 0; i < myIDs.length; i++)
    {
      if(this.searchArray(pcover[myIDs[i]], kingLocation))
      {
        return true;
      }
    }
    return false;
  }

  testCheckMate(color, pcover){
    let cover = {...pcover};
    let numMoves = 0;
    const myIDs = this.state.myIDs;
    for(let i = 0; i < myIDs.length; i++)
    {
      numMoves = numMoves + cover[myIDs[i]].length; 
    }
    if(numMoves === 0)
    {
      return true;
    }else{
      return false;
    }
  }

  tileClickHandler(row, col)
  {
    //let history = [...this.state.history];
    //const current = history[history.length - 1];
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    //const tiles = current.tiles.slice();
    let tiles = [];
    for(let i = 0; i < current.tiles.length; i++)
    {
      let curr_row = [];
      for(let j = 0; j < current.tiles[i].length; j++)
      {
        let curr_tile = {value:current.tiles[i][j].value, component: current.tiles[i][j].component, color:current.tiles[i][j].color, initColor:current.tiles[i][j].initColor};
        curr_row = [...curr_row, curr_tile];
      }
      tiles = [...tiles, curr_row];
    }

    const target = tiles[row][col];
    const target_component = target.component;
    const target_value = target.value;

    let kingSelected = false;
    let curr_cover;
    let enterHighlightStage = false;

    if(this.state.current === null)
    {
      //we have not selected any pieces
      if(this.state.playerIsNext)
      {
        if(target_value != null)
        {
          if(target_value.color === this.state.player)
          {
            //player has selected a piece (target)
            this.setState({current: {data:target, row:row, col:col}});
            enterHighlightStage = true;
          }else
          {
            console.log("player attempted to move opponent piece");
            return;
          } 
        }
      }else
      {
        if(target_value != null)
        {
          if(target_value.color === this.state.opponent)
          {
            //opponent has selected a piece (target)
            this.setState({current: {data:target, row:row, col:col}});
            enterHighlightStage = true;
          }else
          {
            console.log("opponent attempted to move player piece");
            return;
          } 
        }
      }
      
      if(enterHighlightStage)
      {
        const m_piece = {data:target, row:row, col:col};
        let m_pieceCover;
        if(m_piece.data.value.color === this.state.player)
        {
          m_pieceCover = this.state.playerPiecesCover[m_piece.data.value.ID];
        }else{
          m_pieceCover = this.state.opponentPiecesCover[m_piece.data.value.ID];
        }
        
        for(let i = 0; i < m_pieceCover.length; i++)
        {
          const curr_coord = m_pieceCover[i];
          const currTileContent = tiles[curr_coord[0]][curr_coord[1]]; 
          tiles[curr_coord[0]][curr_coord[1]] = {...currTileContent, color:"highlight square"};
        }

        //keep this regardless
        history[history.length-1] = {...history[history.length-1], tiles:tiles};
        this.setState({history:history, highlightedTiles: m_pieceCover});
        
      }

    }else
    {
      //we have selected a piece
      //the reference to our piece
      /*
        structure of current:
          - {data:{value, component, color} , row:row, col:col}
          - we can omit color within data since it is the color of the tile and should not be modified
      */
      const current = this.state.current;
      const cover = this.state.highlightedTiles;
      if(!this.searchArray(cover,[row,col]))
      {
        //if [row,col] is not in cover, then the selected tile is invalid
        //reset the tile highlighting
        //const tempHighlight = this.state.highlightedTiles;
        for(let i = 0; i < cover.length; i++)
        {
          const curr_coord = cover[i];
          const currTileContent = tiles[curr_coord[0]][curr_coord[1]]; 
          const m_color = currTileContent.initColor;
          tiles[curr_coord[0]][curr_coord[1]] = {...currTileContent, color: m_color};
        }
        history[history.length-1] = {...history[history.length-1], tiles:tiles};
        this.setState({
          history: history,
          current: null,
          highlightedTiles: [],
        });
        return;
      }
      
      //handles castling and basic king moves
      let movedRook;
      let coordSource;
      let coordDest;
      let rookTarget;
      let castling = false;
      let finalCoord;
      if(current.data.value.ID === "king" && target_value === null)
      {
        //move the king
        tiles[row][col] = {...tiles[row][col], value:current.data.value, component: current.data.component};
        tiles[current.row][current.col] = {...tiles[current.row][current.col], value: null, component: null};
        
        //determine which rook to move
        if(current.data.value.color === this.state.player)
        { 
          coordSource = {...this.state.playerPieces};
          coordDest = [[7,3],[7,5]];
        }else{
          coordSource = {...this.state.opponentPieces};
          coordDest = [[0,3],[0,5]];
        }

        if(col - current.col === 2)
        {
          //we are doing castling with rook1
          console.log("we are castling");
          const initCoord = coordSource["rook1"];
          finalCoord = coordDest[1];
          movedRook = {value: tiles[initCoord[0]][initCoord[1]].value, component:tiles[initCoord[0]][initCoord[1]].component};
          tiles[initCoord[0]][initCoord[1]] = {...tiles[initCoord[0]][initCoord[1]], value:null, component:null};
          tiles[finalCoord[0]][finalCoord[1]] = {...tiles[finalCoord[0]][finalCoord[1]], value:movedRook.value, component: movedRook.component};
          castling = true;
        }else if(col - current.col === -2)
        {
          //we are doing castling with rook0
          console.log("we are castling");
          const initCoord = coordSource["rook0"];
          finalCoord = coordDest[0];
          movedRook = {value: tiles[initCoord[0]][initCoord[1]].value, component:tiles[initCoord[0]][initCoord[1]].component};
          tiles[initCoord[0]][initCoord[1]] = {...tiles[initCoord[0]][initCoord[1]], value:null, component:null};
          tiles[finalCoord[0]][finalCoord[1]] = {...tiles[finalCoord[0]][finalCoord[1]], value:movedRook.value, component: movedRook.component};
          castling = true;
        }
        
      }else if(target_value === null)
      {
        //move the piece to an empty tile
        //here we set the target tile parameters
        tiles[row][col] = {...tiles[row][col], value:current.data.value, component: current.data.component};
        //here we set the old tile parameters
        tiles[current.row][current.col] = {...tiles[current.row][current.col], value: null, component: null};
      }else if(target_value.color != current.data.value.color)
      {
          //we only capture if the target is of different color
          //first we add the captured piece to the capturedPieces state property
          let capturedPieces;
          if(current.data.value.color === this.state.player)
          {
            capturedPieces = this.state.opponentCapturedPieces;
            this.setState({opponentCapturedPieces: [...capturedPieces, target_component]});
          }else
          {
            capturedPieces = this.state.playerCapturedPieces;
            this.setState({playerCapturedPieces: [...capturedPieces, target_component]});
          }
          
          
          //here we set the target tile parameters to the current value
          tiles[row][col] = {...tiles[row][col], value:current.data.value, component: current.data.component};
          //here we set the old tile parameters to be null
          tiles[current.row][current.col] = {...tiles[current.row][current.col], value: null, component: null};
      }

      //update the playerPieces or opponentPieces state
      let movedPieces;
      let oppPieces;

      //determine who's turn it is next, used for argument for generateAbsoluteCover
      let nextTurnOwner;

      if(current.data.value.color === this.state.player)
      {
        nextTurnOwner = this.state.opponent;
      }else{
        nextTurnOwner = this.state.player;
      }

      if(current.data.value.color === this.state.player)
      {
        movedPieces = {...this.state.playerPieces};
        movedPieces[current.data.value.ID] = [row, col];
        if(castling)
        {
          movedPieces[movedRook.value.ID] = finalCoord;
        }
        if(target_value !== null)
        {
          oppPieces = {...this.state.opponentPieces};
          oppPieces[target_value.ID] = [-1,-1];
          this.setState({opponentPieces: oppPieces, playerPieces: movedPieces}, () => {
                                        const m_cover = this.generateAbsoluteCover(tiles, this.state.opponent);
                                        const o_cover = this.generateAbsoluteCover(tiles, this.state.player);
                                        const checkMate = this.testCheckMate(this.state.opponent, m_cover);
                                        const check = this.testCheck(this.state.opponent, o_cover);
                                        const check_alt = this.testCheck(this.state.player, m_cover);
                                        this.setState({opponentPiecesCover: m_cover, playerPiecesCover: o_cover,checkMate: checkMate, opponentChecked: check, playerChecked:check_alt})});
        }else
        {
          this.setState({playerPieces:movedPieces},() => {
                                        const m_cover = this.generateAbsoluteCover(tiles, this.state.opponent);
                                        const o_cover = this.generateAbsoluteCover(tiles, this.state.player);
                                        const checkMate = this.testCheckMate(this.state.opponent, m_cover);
                                        const check = this.testCheck(this.state.opponent, o_cover);
                                        const check_alt = this.testCheck(this.state.player, m_cover);
                                        this.setState({opponentPiecesCover: m_cover, playerPiecesCover: o_cover, checkMate: checkMate, opponentChecked: check, playerChecked:check_alt})});
        }
      }else
      {
        movedPieces = {...this.state.opponentPieces};
        movedPieces[current.data.value.ID] = [row,col];
        if(castling)
        {
          movedPieces[movedRook.value.ID] = finalCoord;
        }
        if(target_value !== null)
        {
          oppPieces = {...this.state.playerPieces};
          oppPieces[target_value.ID] = [-1,-1];
          this.setState({playerPieces: oppPieces, opponentPieces: movedPieces},() => {
                                        const m_cover = this.generateAbsoluteCover(tiles, this.state.player);
                                        const o_cover = this.generateAbsoluteCover(tiles, this.state.opponent);
                                        const checkMate = this.testCheckMate(this.state.player, m_cover);
                                        const check = this.testCheck(this.state.player, o_cover);
                                        const check_alt = this.testCheck(this.state.opponent, m_cover);
                                        this.setState({playerPiecesCover: m_cover, opponentPiecesCover: o_cover, checkMate: checkMate, playerChecked: check, opponentChecked:check_alt})})
        }else{
          this.setState({opponentPieces:movedPieces},() => {
                                        const m_cover = this.generateAbsoluteCover(tiles, this.state.player);
                                        const o_cover = this.generateAbsoluteCover(tiles, this.state.opponent);
                                        const checkMate = this.testCheckMate(this.state.player, m_cover);
                                        const check = this.testCheck(this.state.player, o_cover);
                                        const check_alt = this.testCheck(this.state.opponent, m_cover)
                                        this.setState({playerPiecesCover: m_cover, opponentPiecesCover: o_cover, checkMate: checkMate, playerChecked: check, opponentChecked:check_alt})});
        }
      }

      
      //reset the tile highlighting
      const tempHighlight = this.state.highlightedTiles;
      for(let i = 0; i < tempHighlight.length; i++)
      {
        const curr_coord = tempHighlight[i];
        const currTileContent = tiles[curr_coord[0]][curr_coord[1]]; 
        const m_color = currTileContent.initColor;
        tiles[curr_coord[0]][curr_coord[1]] = {...currTileContent, color: m_color};
      }

      if(current.data.value.ID === "king")
      {
        if(current.data.value.color === this.state.player)
        {
          this.setState({playerKingMoved: true});
        }else
        {
          this.setState({opponentKingMoved: true});
        }
      }

      if(current.data.value.ID === "rook0")
      {
        if(current.data.value.color === this.state.player)
        {
          this.setState({playerRook0Moved: true});
        }else
        {
          this.setState({opponentRook0Moved: true});
        }
      }

      if(current.data.value.ID === "rook1")
      {
        if(current.data.value.color === this.state.player)
        {
          this.setState({playerRook1Moved: true});
        }else
        {
          this.setState({opponentRook1Moved: true});
        }
      }

      //always reset current to null after each successful move
      this.setState({
          history: history.concat([{tiles:tiles}]),
          playerIsNext: !this.state.playerIsNext,
          stepNumber: history.length,
          current: null,
          highlightedTiles: [],
        });
    }
  }

  testFunction = () => {
    return [1,2,3];
  }

  testHandler = () =>
  {
    let test = [[1,2],[3,4]];
    if(this.searchArray(test,[1,2]))
    {
      console.log("the value was found");
    }
    
    
  }
  /*
    test notes:
    - we can return arrays from functions
    - JSON.stringify([1,2]) returns "[1,2]"

  */

  getComponentByID(ID, color)
  {
    let compSet;
    let m_comp;
    if(color === this.state.player)
    {
      compSet = {...this.state.playerPieceComponents};
    }else
    {
      compSet = {...this.state.opponentPieceComponents};
    }
    switch(ID.substring(0,4))
        {
          case "pawn":
            m_comp = compSet.pawn;
            break;
          case "rook":
            m_comp = compSet.rook;
            break;
          case "bish":
            m_comp = compSet.bishop;
            break;
          case "knig":
            m_comp = compSet.knight;
            break;
          case "quee":
            m_comp = compSet.queen;
            break;
          case "king":
            m_comp = compSet.king;

        }
    return m_comp;
  }

  //resets the state upon a jumpto action
  resetState(){
    const tiles = [...this.state.history[this.state.stepNumber].tiles];
    let playerPiecesPresent = [];
    let opponentPiecesPresent = [];
    let playerPieces = {};
    let opponentPieces = {};
    for(let i = 0; i < tiles.length; i++)
    {
      for(let j = 0; j < tiles[i].length; j++)
      {
        tiles[i][j] = {...tiles[i][j], color: tiles[i][j].initColor};
        if(tiles[i][j].value != null)
        {
          const m_id = tiles[i][j].value.ID;
          const owner = tiles[i][j].value.color;
          if(owner === this.state.player)
          {
            playerPieces[m_id] = [i,j];
            playerPiecesPresent = [...playerPiecesPresent, m_id];
          }else
          {
            opponentPieces[m_id] = [i,j];
            opponentPiecesPresent = [...opponentPiecesPresent, m_id];
          }
        }
      }
    }

    let playerCapturedPieces = [];
    let opponentCapturedPieces = [];
    //check to see which pieces were not found in tiles, in which case they are captured
    const myIDs = this.state.myIDs;
    for(let k = 0; k < myIDs.length; k++)
    {
      const curr = myIDs[k];
      if(typeof(playerPiecesPresent.find((elem) =>  elem === curr)) === "undefined")
      {
        console.log("im here");
        const m_comp = this.getComponentByID(curr, this.state.player);
        playerPieces[curr] = [-1,-1];
        playerCapturedPieces = [...playerCapturedPieces, m_comp];
      }
      if(typeof(opponentPiecesPresent.find((elem) => elem === curr)) === "undefined")
      {
        console.log("im here");
        const m_comp = this.getComponentByID(curr, this.state.opponent);
        opponentPieces[curr] = [-1,-1];
        opponentCapturedPieces = [...playerCapturedPieces, m_comp];
      }
    }


    this.setState({ highlightedTiles:[],
                    playerPieces: playerPieces,
                    opponentPieces: opponentPieces,
                    playerCapturedPieces: playerCapturedPieces,
                    opponentCapturedPieces: opponentCapturedPieces}, () => {const playerCover = this.generateAbsoluteCover(tiles, this.state.player)
                                                            const oppCover = this.generateAbsoluteCover(tiles, this.state.opponent)
                                                            const playerCheck = this.testCheck(this.state.player, oppCover);
                                                            const oppCheck = this.testCheck(this.state.opponent, playerCover);
                                                            this.setState({ playerPiecesCover: playerCover, 
                                                                            opponentPiecesCover: oppCover,
                                                                            playerChecked:playerCheck,
                                                                            opponentChecked: oppCheck})}); 
  }

  jumpTo(step) {
    if(step < 0)
      return;
    if(this.state.checkMate)
      return;    
    this.setState({
      stepNumber: step,
      playerIsNext: (step % 2) === 0,
      current: null,
    },() => {this.resetState()});
  }

  render(){
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    console.log("step number " + this.state.stepNumber);
    console.log(current);
    const rank = this.state.rank;
    const selected = this.state.current;

    let currentPiece = null;
    let currentPlayer = null;
    let cover = null;
    let checkMate = null;
    let check = null;

    if(this.state.checkMate)
    { 
      let winner;
      if(!this.state.playerIsNext)
      {
        winner = this.state.player;
      }else
      {
        winner = this.state.opponent;
      }
      checkMate = (<p>CHECK MATE! {winner} wins!</p>);
    }else if(this.state.playerChecked || this.state.opponentChecked)
    {
      check = (<p>CHECK</p>);
    }

    if(selected != null)
    {
      currentPiece = selected.data.value.ID;
      currentPlayer = selected.data.value.color;
      cover = this.generateCoverByID(selected.row, selected.col, currentPlayer, current.tiles, currentPiece);

    }

    

    // const moves = history.map((step, move) => {
    //   const desc = move ?
    //     'Go to move #' + move :
    //     'Go to game start';
    //   return (
    //     <li key={move}>
    //       <button onClick={() => this.jumpTo(move)}>{desc}</button>
    //     </li>
    //   );
    // });

    return(
      <div className="game">
        {checkMate}
        {check}
        <CapturedPieces captured={this.state.playerCapturedPieces}/>
        <CapturedPieces captured={this.state.opponentCapturedPieces}/>
        <CheckDisplay check={this.state.playerCheck || this.state.opponentCheck}/>
        <div className="game-board">
          <Board tiles={current.tiles} rank={rank} player={this.state.player} onClick={(row,col) => this.tileClickHandler(row,col)}/>
        </div>
        <div className="game-info">
          <TurnIndicator playerTurn={this.state.playerIsNext}/>
          <button onClick={() => this.jumpTo(this.state.stepNumber-1)}>Undo</button>
        </div>
      </div>
    );
  }
}

export default Game;

//put the following line within the render methods return statement to add TestDisplay
//<TestDisplay piece={currentPiece} player={currentPlayer} cover={cover} playerPieces={this.state.playerPieces} opponentPieces={this.state.opponentPieces}/>

//if we need a test button
//<button onClick={this.testHandler}>Test Button</button>