/*
  This class 

*/

class CoverGenerator
{
  constructor(player)
  {
    let opponent;
    if(player === "white"){
      opponent = "black";
    }else{
      opponent = "white";
    }

    this.state = {
      player:player,
      opponent:opponent,
    }
  }

  //cover generator functions
  generatePawnCover = (row, col, color, tiles) =>
  {
    let legalMovesPawn = [];
    if(color === this.state.player)
    {
      if(row > -1 && row < 8 && col > -1 && col < 8)
      {
        //can potentially move forward by 1 or capture
        if(row-1 > -1 && tiles[row-1][col].value === null){
          legalMovesPawn = [...legalMovesPawn, [row-1, col]];
        }
        if(row-1 > -1 && col+1 < 8 && tiles[row-1][col+1].value !== null)
        {
          if(tiles[row-1][col+1].value.color !== color)
          {
            legalMovesPawn = [...legalMovesPawn, [row-1, col+1]];    
          }
        }
        if(row-1 > -1 && col - 1 > -1 && tiles[row-1][col-1].value !== null)
        {
          if(tiles[row-1][col-1].value.color !== color)
          {
            legalMovesPawn = [...legalMovesPawn, [row-1, col-1]];    
          }
        }
        if(row === 6)
        {
          if(tiles[row-1][col].value === null && tiles[row-2][col].value === null){
            legalMovesPawn = [...legalMovesPawn, [row-2, col]];
          }
        }
      }
    }else if(color === this.state.opponent)
    {
      //can potentially move forward by 1 or capture
      if(row > -1 && row < 8 && col > -1 && col < 8)
      {
        if(row+1 < 8 && tiles[row+1][col].value === null){
          legalMovesPawn = [...legalMovesPawn, [row+1, col]];
        }
        if(row + 1 < 8 && col + 1 < 8 && tiles[row+1][col+1].value !== null)
        {
          if(tiles[row+1][col+1].value.color !== color)
          {
            legalMovesPawn = [...legalMovesPawn, [row+1, col+1]];    
          }
        }
        if(row + 1 < 8 && col-1 > -1 && tiles[row+1][col-1].value !== null)
        {
          if(tiles[row+1][col-1].value.color !== color)
          {
            legalMovesPawn = [...legalMovesPawn, [row+1, col-1]];    
          }
        }
        if(row === 1)
        {
          if(tiles[row+1][col].value === null && tiles[row+2][col].value === null){
            legalMovesPawn = [...legalMovesPawn, [row+2, col]];
          }
        }
      }
      
    }
    return legalMovesPawn;
  }

  generateKnightCover = (row, col, color, tiles) =>
  {
    if(row === -1 && col === -1)
      return [];
    const legalMovesKnight = [  [row+2, col-1],
                                [row+2, col+1],
                                [row-2, col-1],
                                [row-2, col+1],
                                [row-1, col+2],
                                [row+1, col+2],
                                [row-1, col-2],
                                [row+1, col-2]];
    let knightCover = legalMovesKnight.filter((coord) => {
      if(coord[0] > 7 || coord[0] < 0 || coord[1] > 7 || coord[1] < 0)
      {
        return false;
      }

      if(tiles[coord[0]][coord[1]].value === null)
      {
        return true;
      }
      else if(tiles[coord[0]][coord[1]].value != null)
      {
        if(tiles[coord[0]][coord[1]].value.color != color)
        {
          return true;
        }else
        {
          return false;
        }
      }
    }); 
    return knightCover;
  }

  generateRookCover = (row, col, color, tiles) =>
  {
    if(row === -1 && col === -1)
      return [];
    let rookCover = [];
    let iOngoing = true;
    let jOngoing = true;
    let kOngoing = true;
    let lOngoing = true;
    if(row > 7 || row < 0 || col > 7 || col < 0)
    {
      return rookCover;
    }
    for(let i = row+1, j = row-1, k = col+1, l = col-1; i < 8 || j > -1 || k < 8 || l > -1; i++, j--, k++, l--)
    {
      const curr_i = [i, col];
      const curr_j = [j, col];
      const curr_k = [row, k];
      const curr_l = [row, l];
      
      if(iOngoing && i < 8)
      {
        if(tiles[curr_i[0]][curr_i[1]].value === null)
          {
            //if the currently examined tile is null we add it to the cover
            rookCover = [...rookCover, curr_i];
          }else if(tiles[curr_i[0]][curr_i[1]].value.color !== color){
              rookCover = [...rookCover, curr_i];
              iOngoing = false;
          }else
          {
            iOngoing = false;
          }
      }

      if(kOngoing && k < 8)
      {
        if(tiles[curr_k[0]][curr_k[1]].value === null)
        {
          rookCover = [...rookCover, curr_k];
        }else if(tiles[curr_k[0]][curr_k[1]].value.color !== color)
        {
          rookCover = [...rookCover, curr_k];
          kOngoing = false;
        }else{
          kOngoing = false;
        }
      }

      if(jOngoing && j > -1)
      {
        if(tiles[curr_j[0]][curr_j[1]].value === null)
        {
          rookCover = [...rookCover, curr_j];
        }else if(tiles[curr_j[0]][curr_j[1]].value.color !== color){
          rookCover = [...rookCover, curr_j];
          jOngoing = false;
        }else
        {
          jOngoing = false;
        }
      }

      if(lOngoing && l > -1)
      {
        if(tiles[curr_l[0]][curr_l[1]].value === null)
        {
          rookCover = [...rookCover, curr_l];
        }else if(tiles[curr_l[0]][curr_l[1]].value.color !== color){
          rookCover = [...rookCover, curr_l];
          lOngoing = false;
        }else
        {
          lOngoing = false;
        }
      }
    }
    return rookCover;
  }

  generateBishopCover = (row, col, color, tiles) =>
  {
    if(row === -1 && col === -1)
      return [];
    let bishopCover = [];
    let ijOngoing = true;
    let klOngoing = true; 
    for(let i = row+1, j = col+1, k = row-1, l = col-1; i < 8 || j < 8 || k > -1 || l > -1; i++, j++, k--, l--)
    {
      const curr_ij = [i, j];
      const curr_kl = [k, l];
      if(ijOngoing && (i < 8 && j < 8))
      {
        if(tiles[curr_ij[0]][curr_ij[1]].value === null)
        {
          bishopCover = [...bishopCover, curr_ij];
        }else if(tiles[curr_ij[0]][curr_ij[1]].value.color !== color)
        {
          bishopCover = [...bishopCover, curr_ij];
          ijOngoing = false;
        }else
        {
          ijOngoing = false;
        }
      }

      if(klOngoing && (k > -1 && l > -1))
      {
        if(tiles[curr_kl[0]][curr_kl[1]].value === null)
        {
          bishopCover = [...bishopCover, curr_kl];
        }else if(tiles[curr_kl[0]][curr_kl[1]].value.color !== color)
        {
          bishopCover = [...bishopCover, curr_kl];
          klOngoing = false;
        }else{
          klOngoing = false;
        }
      }
    }

    ijOngoing = true;
    klOngoing = true;
    for(let i = row+1, j = col-1, k = row-1, l = col+1; i < 8 || j > -1 || k > -1 || l < 8; i++, j--, k--, l++)
    {
      const curr_ij = [i, j];
      const curr_kl = [k, l];
      if(ijOngoing && (i < 8 && j > -1))
      {
        if(tiles[curr_ij[0]][curr_ij[1]].value === null)
        {
          bishopCover = [...bishopCover, curr_ij];
        }else if(tiles[curr_ij[0]][curr_ij[1]].value.color !== color)
        {
          bishopCover = [...bishopCover, curr_ij];
          ijOngoing = false;
        }else
        {
          ijOngoing = false;
        }
      }

      if(klOngoing && (k > -1 && l < 8))
      {
        if(tiles[curr_kl[0]][curr_kl[1]].value === null)
        {
          bishopCover = [...bishopCover, curr_kl];
        }else if(tiles[curr_kl[0]][curr_kl[1]].value.color !== color)
        {
          bishopCover = [...bishopCover, curr_kl];
          klOngoing = false;
        }else{
          klOngoing = false;
        }
      }
    }

    return bishopCover;
  }

  generateQueenCover = (row, col, color, tiles) =>
  {
    if(row === -1 && col === -1)
      return [];
    let queenCover = this.generateBishopCover(row,col,color,tiles).concat(this.generateRookCover(row,col,color,tiles));
    return queenCover;
  }

  
  generateKingCover = (row, col, color, tiles) =>
  {
    const legalMovesKing = [[row-1,col-1],
                            [row-1,col],
                            [row-1, col+1],
                            [row,col-1],
                            [row, col+1],
                            [row+1,col-1],
                            [row+1, col],
                            [row+1, col+1]];
    let kingCover = legalMovesKing.filter((coord) => {
      if(coord[0] > 7 || coord[0] < 0 || coord[1] > 7 || coord[1] < 0)
      {
        return false;
      }
      if(tiles[coord[0]][coord[1]].value === null)
      {
        return true;
      }
      else if(tiles[coord[0]][coord[1]].value != null)
      {
        if(tiles[coord[0]][coord[1]].value.color != color)
        {
          return true;
        }else
        {
          return false;
        }
      }
    }); 

    return kingCover;
  }
}

export default CoverGenerator;