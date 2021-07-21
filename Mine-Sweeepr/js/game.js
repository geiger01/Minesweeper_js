const FLAG = '🚩';
const MINE = '💣';
const MINES_AMOUNT = 15;
var gBoard;

const MINE_IMG = `<img src="imgs/icon.png">`;
const gColors = ['green', 'blue', 'yellow', 'red', 'purple'];

function init() {
  // reset() TODO
  gBoard = makeMat(8, 8);
  renderBoard(gBoard);
  var minesPos = getMinesPos(gBoard, MINES_AMOUNT);
  renderMines(minesPos);
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
  // update dom
  elCell.classList.add('pressed');
  // update model
  gBoard[i][j].isShown = true;

  // update DOM
  renderBoard(gBoard);
}

function cellMarked(elCell, i, j) {
  gBoard[i][j].isMarked = true;

  renderBoard(gBoard);
}
