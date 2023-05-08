import { Component } from '@angular/core';

import { IdToImage } from '../schemaHelper'
@Component({
  selector: 'app-minesweeper-game-play',
  templateUrl: './minesweeper-game-play.component.html',
  styleUrls: ['./minesweeper-game-play.component.css']
})
export class MinesweeperGamePlayComponent {

  AllCells: Array<GameCells> = [];
  setMines: number = 0;
  numMinesLeft: number = this.setMines;
  viewBoard: boolean = false;
  mineLocations: Array<string> = [];
  gameOver: boolean = false;
  gameAlreadyOver: boolean = false;
  Lose: boolean = false;
  Win: boolean = false;
  started: boolean = false;
  Flipped: number = 0;
  
  row: number = 8;
  col: number = 16;
  /*
  constructor(Row: number, Col: number) {

  }*/
  ngOnInit() {
    this.setGameBoard();
  }

  setGameBoard() {
    this.AllCells.splice(0);
    this.mineLocations.splice(0);
    if (this.setMines > 0) {

      var indices: Array<number> = this.SetMines(8, 16);
      var mineCounter = 0;
      // Set initial cells on board
      for (var i = 0; i < 8; i++) {
        var gameCells: GameCells = new GameCells([]);
        for (var j = 0; j < 16; j++) {

          var isMine: boolean;
          var cardID = Math.floor(Math.random() * 28) + 1;
          if (indices.includes(mineCounter))
            isMine = true;

          else
            isMine = false;

          var newCell = new GameCell(IdToImage(cardID), "/assets/images/minesweeperImages/qMark.png", isMine, cardID, i, j);

          gameCells.gameCells.push(newCell);
          mineCounter++;

        }
        this.AllCells.push(gameCells);
      }

      for (var x = 0; x < this.AllCells.length; x++) {
        for (var y = 0; y < this.AllCells.at(x)!.gameCells.length; y++) {
          //var newCell = this.AllCells.at(x)!.gameCells.at(y)!;
          this.setNeighbors(this.AllCells.at(x)!.gameCells.at(y)!);

          for (var z = 0; z < this.AllCells.at(x)!.gameCells.at(y)!.neighbors.length; z++) {
            if (this.AllCells.at(x)!.gameCells.at(y)!.neighbors.at(z)?.isMine) {

              this.AllCells.at(x)!.gameCells.at(y)!.mines += 1;
            }

          }

        }
      }

      for (var b = 0; b < this.AllCells.length; b++) {
        for (var c = 0; c < this.AllCells.at(b)!.gameCells.length; c++) {

          this.numNeighbors(this.AllCells.at(b)!.gameCells.at(c)!);
        }
      }
    }
  }

  setNeighbors(cell: GameCell) {
    
    if (cell.IsNormal(cell)) {
      //console.log("\nNORMAL!\n");
      var locations: Array<cellLocation> = [];

      locations.push(new cellLocation(cell.row - 1, cell.column - 1));
      locations.push(new cellLocation(cell.row - 1, cell.column));
      locations.push(new cellLocation(cell.row - 1, cell.column + 1));
      locations.push(new cellLocation(cell.row, cell.column - 1));
      locations.push(new cellLocation(cell.row, cell.column + 1));
      locations.push(new cellLocation(cell.row + 1, cell.column - 1));
      locations.push(new cellLocation(cell.row + 1, cell.column));
      locations.push(new cellLocation(cell.row + 1, cell.column + 1));

      this.createLocations(locations, cell);
      return;
    }

    // If cell is in bottom right corner
    else if (cell.IsBottom(cell) && cell.IsCorner(cell) && cell.IsRightSide(cell)) {

      //console.log("\nBOTTOM RIGHT CORNER!\n");
      var locations: Array<cellLocation> = [];

      locations.push(new cellLocation(cell.row - 1, cell.column - 1));
      locations.push(new cellLocation(cell.row - 1, cell.column));
      locations.push(new cellLocation(cell.row, cell.column - 1));

      this.createLocations(locations, cell);
      return;
    }

    // If cell is in bottom left corner
    else if (cell.IsBottom(cell) && cell.IsCorner(cell) && cell.IsLeftSide(cell)) {
      //console.log("\nBOTTOM LEFT CORNER!\n");
      var locations: Array<cellLocation> = [];

      locations.push(new cellLocation(cell.row - 1, cell.column));
      locations.push(new cellLocation(cell.row - 1, cell.column + 1));
      locations.push(new cellLocation(cell.row, cell.column + 1));

      this.createLocations(locations, cell);
      return;
    }

    // If cell is on bottom and is not a corner
    else if (cell.IsBottom(cell) && !cell.IsCorner(cell)) {

      //console.log("\nBOTTOM!\n");
      var locations: Array<cellLocation> = [];

      locations.push(new cellLocation(cell.row - 1, cell.column - 1));
      locations.push(new cellLocation(cell.row - 1, cell.column));
      locations.push(new cellLocation(cell.row - 1, cell.column + 1));
      locations.push(new cellLocation(cell.row, cell.column - 1));
      locations.push(new cellLocation(cell.row, cell.column + 1));

      this.createLocations(locations, cell);
      return;
    }

    // If cell is in top right corner
    else if (cell.IsTop(cell) && cell.IsCorner(cell) && cell.IsRightSide(cell)) {
      //console.log("\nTOP RIGHT CORNER!\n");
      var locations: Array<cellLocation> = [];

      locations.push(new cellLocation(cell.row, cell.column - 1));
      locations.push(new cellLocation(cell.row + 1, cell.column - 1));
      locations.push(new cellLocation(cell.row + 1, cell.column));

      this.createLocations(locations, cell);
      return;
    }

    // If cell is in top left corner
    else if (cell.IsTop(cell) && cell.IsCorner(cell) && cell.IsLeftSide(cell)) {

      //console.log("\nTOP LEFT CORNER!\n");
      var locations: Array<cellLocation> = [];

      locations.push(new cellLocation(cell.row, cell.column + 1));
      locations.push(new cellLocation(cell.row + 1, cell.column));
      locations.push(new cellLocation(cell.row + 1, cell.column + 1));

      this.createLocations(locations, cell);
      return;
    }

    // If cell is on top and is not a corner
    else if (cell.IsTop(cell) && !cell.IsCorner(cell)) {
      //console.log("\nTOP!\n");
      var locations: Array<cellLocation> = [];

      locations.push(new cellLocation(cell.row, cell.column - 1));
      locations.push(new cellLocation(cell.row, cell.column + 1));
      locations.push(new cellLocation(cell.row + 1, cell.column - 1));
      locations.push(new cellLocation(cell.row + 1, cell.column));
      locations.push(new cellLocation(cell.row + 1, cell.column + 1));

      this.createLocations(locations, cell);
      return;
    }


    // If cell is on right and is not a corner
    else if (cell.IsRightSide(cell) && !cell.IsCorner(cell)) {

      //console.log("\nRIGHT SIDE!\n");
      var locations: Array<cellLocation> = [];

      locations.push(new cellLocation(cell.row - 1, cell.column - 1));
      locations.push(new cellLocation(cell.row - 1, cell.column));
      locations.push(new cellLocation(cell.row, cell.column - 1));
      locations.push(new cellLocation(cell.row + 1, cell.column - 1));
      locations.push(new cellLocation(cell.row + 1, cell.column));

      this.createLocations(locations, cell);
      return;
    }

    // If cell is on left and is not a corner
    else if (cell.IsLeftSide(cell) && !cell.IsCorner(cell)) {

      //console.log("\nLEFT SIDE!\n");
      var locations: Array<cellLocation> = [];

      locations.push(new cellLocation(cell.row - 1, cell.column));
      locations.push(new cellLocation(cell.row - 1, cell.column + 1));
      locations.push(new cellLocation(cell.row, cell.column + 1));
      locations.push(new cellLocation(cell.row + 1, cell.column));
      locations.push(new cellLocation(cell.row + 1, cell.column + 1));

      this.createLocations(locations, cell);
      return;
    }

    //console.log("\nNONE OF THESE????\n");
  }

  createLocations(locations: Array<cellLocation>, cell: GameCell): GameCell {

    for (var i = 0; i < locations.length; i++) {
      var loc = locations.at(i);

        cell.neighbors.push(this.AllCells.at(loc!.row)!.gameCells.at(loc!.column)!);
    }

    //console.log("\nINDEX: (" + cell.row + ", " + cell.column + ")\n");
    //console.log("\nNeighbors: " + cell.neighbors + "\n");


    return cell;
  }

  reveal(cell: GameCell) {
    this.started = true;
    if (this.gameAlreadyOver)
      return;
    if (this.setMines > 0) {

      var select = document.getElementById("levels") as HTMLSelectElement;
      select.disabled = true;
      if (cell.flag)
        return;
      if (!cell.isMine && !cell.surroundingMines)
        this.flipNeighbors(cell);

      else if (!cell.isMine && cell.surroundingMines)
        this.Flipped += 1;

      cell.flipped = true;
      this.GameOver(cell);
      if (this.gameOver === true) {
        this.gameAlreadyOver = true;
          for (var b = 0; b < this.AllCells.length; b++) {
            for (var c = 0; c < this.AllCells.at(b)!.gameCells.length; c++) {
              this.AllCells.at(b)!.gameCells.at(c)!.flipped = true;
              this.AllCells.at(b)!.gameCells.at(c)!.flag = false;
            }
          }
        }
      }
  }
  flipNeighbors(cell: GameCell){

    if (cell.surroundingMines || cell.flipped) {

      if (cell.flipped === false)
        this.Flipped += 1;
      cell.flipped = true;
      return;
    }

    if (cell.flipped === false)
      this.Flipped += 1;
    cell.flipped = true;

    for (var v = 0; v < cell.neighbors.length; v++) {
      if (!cell.neighbors.at(v)!.isMine)
        this.flipNeighbors(cell.neighbors.at(v)!);
    }
    return;
  }
  ViewBoard() {

    if (this.viewBoard === true)
      this.viewBoard = false;

    else
      this.viewBoard = true;
  }
  GameOver(cell: GameCell): boolean {

    if (cell.isMine && cell.flipped) {
      this.gameOver = true;
      this.Lose = true;
      var select = document.getElementById("levels") as HTMLSelectElement;
      select.disabled = false;
      this.started = false;
      return true;
    }

    if (this.Flipped === this.row * this.col - this.setMines) {
      this.gameOver = true;
      this.Win = true;
      var select = document.getElementById("levels") as HTMLSelectElement;
      select.disabled = false;
      this.started = false;
      return true;
    }

    return false;
  }

  restartGame() {
    this.Lose = false;
    this.Win = false;
    this.gameOver = false;
    this.gameAlreadyOver = false;
    this.Flipped = 0;
    this.numMinesLeft = this.setMines;
    this.started = false;
    this.viewBoard = false;
    var select = document.getElementById("levels") as HTMLSelectElement;
    select.disabled = false;
    var index = select.selectedIndex;

    if (index === 1) {
      this.setMines = 5;
      this.numMinesLeft = this.setMines;
    }

    else if (index === 2) {
      this.setMines = 15;
      this.numMinesLeft = this.setMines;
    }

    else if (index === 3) {
      this.setMines = 24;
      this.numMinesLeft = this.setMines;
    }

    else if (index === 4) {
      this.setMines = 40;
      this.numMinesLeft = this.setMines;
    }

    else if (index === 5) {
      this.setMines = 64;
      this.numMinesLeft = this.setMines;
    }
    this.setGameBoard();
  }
  flag(cell: GameCell) {

    this.started = true;
    if (this.gameAlreadyOver)
      return false;
    if (cell.flag === false && cell.flipped === false) {
      this.numMinesLeft -= 1;
      cell.flag = true;
    }

    else if (cell.flag === false && cell.flipped === true)
    {
      cell.flag = false;
    }
    else {
      this.numMinesLeft += 1;
      cell.flag = false;
    }

    var select = document.getElementById("levels") as HTMLSelectElement;
    select.disabled = true;
    return false;
  }

  SetMines(rows: number, cols: number): Array<number> {
    var indices: Array<number> = [];
    var pairs: Array<cellLocation> = [];
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        var pair = new cellLocation(i, j);
        pairs.push(pair);
      }
    }
    var counter = 0;
    while (counter < this.setMines) {
      var randMine: number = Math.floor(Math.random() * pairs.length);
      if (!indices.includes(randMine)) {
        indices.push(randMine);
        this.mineLocations.push(JSON.stringify(pairs.at(randMine)!));
        counter++;
      }
    }

    return indices;
  }

  numNeighbors(cell: GameCell){

    switch (cell.mines) {
      case 1:
        cell.countUrl = "/assets/images/minesweeperImages/number_1.png";
        cell.surroundingMines = true;
          break;

      case 2:
        cell.countUrl = "/assets/images/minesweeperImages/number_2.png";
        cell.surroundingMines = true;
          break;

      case 3:
        cell.countUrl = "/assets/images/minesweeperImages/number_3.png";
        cell.surroundingMines = true;
          break;

      case 4:
        cell.countUrl = "/assets/images/minesweeperImages/number_4.png";
        cell.surroundingMines = true;
          break;

      case 5:
        cell.countUrl = "/assets/images/minesweeperImages/number_5.png";
        cell.surroundingMines = true;
          break;

      case 6:
        cell.countUrl = "/assets/images/minesweeperImages/number_6.png";
        cell.surroundingMines = true;
          break;

      case 7:
        cell.countUrl = "/assets/images/minesweeperImages/number_7.png";
        cell.surroundingMines = true;
          break;

      case 8:
        cell.countUrl = "/assets/images/minesweeperImages/number_8.png";
        cell.surroundingMines = true;
          break;

      default:
        cell.surroundingMines = false;
          break;
    }
    //console.log("\nCOUNT URL: " +cell.countUrl + "\n");
  }

  getLevel() {
    var select = document.getElementById("levels") as HTMLSelectElement;
    var index = select.selectedIndex;

    if (this.started === true) {
      select.disabled = true;
      return;
    }

    if (this.gameAlreadyOver === true)
      return;
    if (index === 1) {
      this.setMines = 5;
      this.numMinesLeft = this.setMines;
    }

    else if (index === 2) {
      this.setMines = 15;
      this.numMinesLeft = this.setMines;
    }

    else if (index === 3) {
      this.setMines = 24;
      this.numMinesLeft = this.setMines;
    }

    else if (index === 4) {
      this.setMines = 40;
      this.numMinesLeft = this.setMines;
    }

    else if (index === 5) {
      this.setMines = 64;
      this.numMinesLeft = this.setMines;
    }

    this.restartGame();
  }
}

class GameCell {

  showTile: string;
  hideTile: string;
  flagTile: string = "/assets/images/minesweeperImages/marioflag.png";
  isMine: boolean;
  cardID: number;
  flipped: boolean;
  row: number;
  column: number;
  tileType: string;
  mines: number = 0;
  surroundingMines: boolean = false;
  countUrl: string = "";
  tileSide: string;
  flag: boolean = false;
  neighbors: Array<GameCell> = [];
  constructor(ShowTile: string, HideTile: string, IsMine: boolean, CardID: number, Row: number, Column: number) {
    this.tileType = "normal";
    this.tileSide = "normal";
    this.showTile = ShowTile;
    this.hideTile = HideTile;
    this.isMine = IsMine;
    this.flipped = false;

    this.row = Row;
    this.column = Column;
    if (IsMine) {
      this.cardID = -1;
      this.showTile = "/assets/images/minesweeperImages/mine.png";
    }

    else {

      this.cardID = CardID;
      this.showTile = IdToImage(CardID);
    }
    //console.log(this.showTile);

  }

  IsCorner(cell: GameCell): boolean {

    if (cell.row === 7 && cell.column === 0) {
      this.tileType = "corner";
      return true;
    }

    if (cell.row === 7 && cell.column === 15) {
      this.tileType = "corner";
      return true;
    }

    if (cell.row === 0 && cell.column === 0) {
      this.tileType = "corner";
      return true;
    }

    if (cell.row === 0 && cell.column === 15) {
      this.tileType = "corner";
      return true;
    }


    this.tileType = "normal";
    return false;
  }

  IsLeftSide(cell: GameCell): boolean {
    if (cell.column === 0) {
      this.tileSide = "leftSide";
      return true;
    }

    return false;
  }

  IsRightSide(cell: GameCell): boolean {

    if (cell.column === 15) {
      this.tileSide = "rightSide";
      return true;
    }

    return false;
  }

  IsBottom(cell: GameCell): boolean {

    if (cell.row === 7) {
      this.tileSide = "bottomSide";
      return true;
    }

    return false;
  }

  IsTop(cell: GameCell): boolean {

    if (cell.row === 0) {
      this.tileSide = "topSide";
      return true;
    }

    return false;
  }

  IsNormal(cell: GameCell): boolean {
    if (!this.IsLeftSide(cell) && !this.IsRightSide(cell) && !this.IsBottom(cell) && !this.IsTop(cell) && !this.IsCorner(cell)) {
      this.tileSide = "normal";
      this.tileType = "normal";
      return true;
    }

    return false;

  }
}

class Play {

  mineCounter: number;
  constructor(counter: number) {
    this.mineCounter = counter;
  }
  startGame() {

  }

  reveal(cell: GameCell) {
    cell.flipped = true;
  }

  flag() {
    cell: GameCell;
  }

  endGame() {

  }
}

class cellLocation {

  row: number;
  column: number;

  constructor(Row: number, Column: number) {
    this.row = Row;
    this.column = Column;
  }
}

class GameCells {
  gameCells: Array<GameCell> = [];

  constructor(game: Array<GameCell>) {
    this.gameCells = game;
  }
}
