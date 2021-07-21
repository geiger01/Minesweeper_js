const FLAG = '🚩';
const MINES_AMOUNT = 1;

var gBoard;
var isGameOn = true;
var gClickCounter = 0;
var gTimerCounter = 1;
var gFlagCounter = MINES_AMOUNT;
var gInterval;
var gNumbersAmount = 0 - MINES_AMOUNT;

const MINE_IMG = `<img src="imgs/icon.png">`;
const gColors = ['green', 'blue', 'yellow', 'red', 'purple'];

function init() {
  reset();
  gBoard = makeMat(2, 2);
  renderBoard(gBoard);
  getMines(gBoard, MINES_AMOUNT);
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
  if (gBoard[i][j].isMarked) return;
  if (gBoard[i][j].isShown) return;
  if (!isGameOn) return;
  if (gBoard[i][j].isMine) gameOver();

  gClickCounter++;
  if (gClickCounter === gNumbersAmount && !gBoard[i][j].isMine) gameWin(); //win game

  if (gClickCounter === 1 && !gBoard[i][j].isMine) startTimer();

  elCell.classList.add('pressed');
  gBoard[i][j].isShown = true;
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
