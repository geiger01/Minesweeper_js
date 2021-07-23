const FLAG = '🚩';
var MINES_AMOUNT = 12;

var gameLevel = 3;
var gLives = 3;

var gHints = 2;
var isHintClicked = false;

var gSafeClick = 3;
var isSafeClick = false;

var gAdminMode = false;
var gMinesAddLeft;
var gAdminClickCounter = 0;

var gBoard;
var isGameOn = true;
var gClickCounter = 0;
var gTimerCounter = 1;
var gFlagCounter = MINES_AMOUNT;
var gInterval;
var gNumbersAmount = 0 - MINES_AMOUNT;

var gGameSize = 8;
var cellIsShownAmount = 0;

const MINE_IMG = `<img src="imgs/icon.png">`;
const gColors = ['green', 'blue', 'yellow', 'red', 'purple'];

function init() {
  reset();
  gBoard = makeMat(gGameSize, gGameSize);
  getMines(gBoard, MINES_AMOUNT);
  renderBoard(gBoard);
}

function renderBoard(mat) {
  var strHtml = '';

  for (var i = 0; i < mat.length; i++) {
    strHtml += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var className = `cell cell-${i}-${j} `;
      var cellContent;
      var numColor;

      if (gBoard[i][j].isMine) {
        if (!isGameOn) {
          gBoard[i][j].isShown = true;
        }
        className += ' mine';
        cellContent = MINE_IMG;
      } else if (!gBoard[i][j].isMine) {
        var cellNumber = countMines(i, j, gBoard); //check the number of the returned mine counter and display it
        gBoard[i][j].minesAroundCount = cellNumber;
        cellContent = cellNumber === 0 ? '' : cellNumber; //if cell number = 0, cellContent='',   else cellContent= number
        numColor = ` style="color: ${gColors[cellNumber - 1]}"`;
      }
      if (!gBoard[i][j].isShown) {
        //to not show the content of the cells
        cellContent = '';
      }
      if (gBoard[i][j].isShown) {
        //check if pressed to add class pressed
        className += ' pressed';
      }
      if (gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
        cellContent = FLAG;
      }
      strHtml += `<td ${numColor} class=" ${className}" oncontextmenu="cellMarked(this,${i},${j}); return false;" onClick="cellClicked(this, ${i},${j})">${cellContent}</td>`;
    }
    strHtml += '</tr>';
  }
  document.querySelector('table').innerHTML = strHtml;
}

// var hi = MINES_AMOUNT;
function cellClicked(elCell, i, j) {
  howManyCellShown(); //to check if win, if number of cells show is same as numbers in board

  if (gAdminMode) {
    if (gAdminClickCounter === 0) resetMines(); //first cell click on admin mode
    if (gBoard[i][j].isMine) return;

    gAdminClickCounter++;

    gMinesAddLeft = MINES_AMOUNT; //so you get the amount of mines per level
    MINES_AMOUNT--;
    gMinesAddLeft--;
    getMinesAdmin(i, j);

    if (gMinesAddLeft === 0) {
      gAdminMode = false;
      document.querySelector('.admin button').classList.remove('adminPressed');
    }

    console.log(gMinesAddLeft);
    renderBoard(gBoard);
    document.querySelector('.flag span').innerText = gMinesAddLeft;
    return;
  }

  document.querySelector('.flag span').innerText = gFlagCounter; //reset the flag counter

  if (gClickCounter === 0 && gBoard[i][j].isMine) {
    init();
    cellClicked(elCell, i, j); //handles first click on mine
    gBoard[i][j].isShown = true;
  }

  if (isHintClicked) {
    showHintedNums(i, j, isHintClicked);
    isHintClicked = false;
    return;
  }

  if (gBoard[i][j].isMarked) return;
  if (gBoard[i][j].isShown) return;
  if (!isGameOn) return;
  if (gBoard[i][j].isMine) {
    gFlagCounter--; //so lives could be implemented
    gLives--;
    updateLives();

    if (gLives === 0) gameOver(); //handles lose
  }

  if (!gBoard[i][j].minesAroundCount) {
    showExpendedNums(i, j);
  }

  gClickCounter++;
  if (gClickCounter === 1 && !gBoard[i][j].isMine) startTimer();

  elCell.classList.add('pressed');
  gBoard[i][j].isShown = true;

  if (
    (gFlagCounter === 0 && isCellShownLeft() && !gBoard[i][j].isMine) ||
    gNumbersAmount === cellIsShownAmount
  ) {
    //handle win
    gameWin();
  }

  renderBoard(gBoard);
  // console.log(gNumbersAmount);
  // console.log(cellIsShownAmount);
}

function cellMarked(elCell, i, j) {
  if (!isGameOn) return;
  if (gBoard[i][j].isShown) return; //Wont let you mark a flag where a number is shown

  if (gBoard[i][j].isMarked) {
    gBoard[i][j].isMarked = false;
    gFlagCounter++;
  } else {
    if (gFlagCounter === 0) return; ////So you wont put more flags if you have 0 left
    gBoard[i][j].isMarked = true;
    gFlagCounter--;
  }

  document.querySelector('.flag span').innerText = gFlagCounter;
  renderBoard(gBoard);
}

function showExpendedNums(cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue;
      if (i === cellI && j === cellJ) continue;

      if (gBoard[i][j].isMarked) {
        gFlagCounter++; //if the expend happend near flag i get the flag back
        gBoard[i][j].isMarked = false;
        gBoard[i][j].isShown = true;
        continue;
      }
      if (gBoard[i][j].isMine || gBoard[i][j].isShown) continue;
      gBoard[i][j].isShown = true;

      if (!gBoard[i][j].minesAroundCount) showExpendedNums(i, j); //expose all nums around if the num mines neghibors= 0
    }
  }
}

function startTimer() {
  var elTimerNumber = document.querySelector('.timer span');
  gInterval = setInterval(function () {
    elTimerNumber.innerText = gTimerCounter;
    gTimerCounter++;
  }, 1000);
}

function gameOver() {
  isGameOn = false;
  clearInterval(gInterval);
  document.querySelector('.restart').innerText = '😱';
  document.querySelector('.lives').innerText = '';
}

function gameWin() {
  document.querySelector('.restart').innerText = '😎';
  clearInterval(gInterval);
}

function reset() {
  clearInterval(gInterval);
  document.querySelector('.restart').innerText = '😮';
  document.querySelector('.hints').innerText = '💡 💡';

  isHintClicked = false;
  gHints = 2;

  cellIsShownAmount = 0;

  if (gGameSize === 12) MINES_AMOUNT = 30;
  if (gGameSize === 8) MINES_AMOUNT = 12;
  if (gGameSize === 4) MINES_AMOUNT = 3;
  gMinesAddLeft = MINES_AMOUNT;
  gAdminMode = false;
  gAdminClickCounter = 0;

  document.querySelector('.safe-click').innerText = '👆 👆 👆';
  isSafeClick = false;
  gSafeClick = 3;

  gNumbersAmount = 0 - MINES_AMOUNT;
  gFlagCounter = MINES_AMOUNT;

  document.querySelector('.flag span').innerText = gFlagCounter;
  isGameOn = true;
  gTimerCounter = 0;
  gClickCounter = 0;
  gLives = gameLevel;
  if (gLives !== 1) document.querySelector('.lives').innerText = '🤍 🤍 🤍';
  else document.querySelector('.lives').innerText = '🤍'; //number of heart displayed

  var elTimerNumber = (document.querySelector('.timer span').innerText =
    gTimerCounter);
}

function isCellShownLeft() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMarked) continue;

      if (!gBoard[i][j].isShown) return false;
    }
  }
  return true;
}

function updateLives() {
  if (gLives === 2) document.querySelector('.lives').innerText = '🤍 🤍';
  if (gLives === 1) document.querySelector('.lives').innerText = '🤍';
}
