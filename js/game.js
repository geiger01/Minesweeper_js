const FLAG = '🚩';
var MINES_AMOUNT = 12;

var gBoard;
var isGameOn = true;
var gClickCounter = 0;
var gTimerCounter = 1;
var gFlagCounter = MINES_AMOUNT;
var gInterval;
var gNumbersAmount = 0 - MINES_AMOUNT;

var gGameSize = 8;
// var cellIsShownAmount = 0;

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
        cellContent = cellNumber === 0 ? '' : cellNumber;
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

function cellClicked(elCell, i, j) {
  if (gClickCounter === 0 && gBoard[i][j].isMine) {
    gBoard[i][j].isMine = false; //handles first click on mine
    gFlagCounter--;
  }
  if (gBoard[i][j].isMarked) return;
  if (gBoard[i][j].isShown) return;
  if (!isGameOn) return;
  if (gBoard[i][j].isMine) gameOver();
  showExpendedNums(elCell, i, j);

  gClickCounter++;
  if (gClickCounter === 1 && !gBoard[i][j].isMine) startTimer();

  elCell.classList.add('pressed');
  gBoard[i][j].isShown = true;

  if (gFlagCounter === 0 && isCellShownLeft() && !gBoard[i][j].isMine) {
    //handle win
    gameWin();

    // return;
  }
  renderBoard(gBoard);
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

function showExpendedNums(elCell, cellI, cellJ) {
  if (
    gBoard[cellI][cellJ].minesAroundCount === 0 &&
    !gBoard[cellI][cellJ].isMine
  ) {
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
        gBoard[i][j].isShown = true;
      }
    }
    console.log(gClickCounter);
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
}

function gameWin() {
  document.querySelector('.restart').innerText = '😎';
  clearInterval(gInterval);
}

function reset() {
  clearInterval(gInterval);
  document.querySelector('.restart').innerText = '😮';
  gNumbersAmount = 0 - MINES_AMOUNT;
  gFlagCounter = MINES_AMOUNT;

  document.querySelector('.flag span').innerText = gFlagCounter;
  isGameOn = true;
  gTimerCounter = 0;
  gClickCounter = 0;

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
