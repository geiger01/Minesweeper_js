var elBoard = document.querySelector('.container');

function makeMat(rows, cols) {
  var mat = [];

  for (var i = 0; i < rows; i++) {
    mat[i] = [];

    for (var j = 0; j < cols; j++) {
      mat[i][j] = {
        minesAroundCount: 1,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
      gNumbersAmount++;
    }
  }
  return mat;
}

function countMines(cellI, cellJ, mat) {
  var mineCount = 0;

  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= mat[i].length) continue;
      if (i === cellI && j === cellJ) continue;
      if (mat[i][j].isMine) mineCount++;
    }
  }

  return mineCount;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function alertErr() {
  alert(`You can't get out!!!`);
}
function gamePopUp() {
  alert(
    'You have 2 hints, 3 safe clicks and an admin mode for you to place the mines yourself.'
  );
}

function rulesPopup() {
  alert(
    'The number on a block shows the number of mines adjacent to it and you have to flag all the mines. To mark a flag on mobile use a long touch on screen'
  );
}

function level(elLevel) {
  if (elLevel.textContent === 'Hard') {
    MINES_AMOUNT = 30;
    gGameSize = 12;
    elBoard.style.width = '35rem';
    gameLevel = 3;

    init();
  }
  if (elLevel.textContent === 'Medium') {
    MINES_AMOUNT = 12;
    gGameSize = 8;
    elBoard.style.width = '25rem';
    gameLevel = 3;

    init();
  }
  if (elLevel.textContent === 'Easy') {
    MINES_AMOUNT = 3;
    gGameSize = 4;
    elBoard.style.width = '23rem';
    gameLevel = 1;

    init();
  }
}

function hintClicked() {
  gHints--;
  if (gHints === 1) document.querySelector('.hints').innerText = '💡';
  if (gHints === 0) document.querySelector('.hints').innerText = '';
  isHintClicked = true;
}

function showHintedNums(cellI, cellJ, isHint) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue;

      if (gBoard[i][j].isShown) continue;

      document.querySelector(`.cell-${i}-${j}`).classList.add('pressed');
      document.querySelector(`.cell-${i}-${j}`).innerText = !gBoard[i][j].isMine ///inner text change if its mine or not
        ? gBoard[i][j].minesAroundCount //if its not a mine show the prev number shown
        : '🧨'; //if its a mine show a pumpkin
    }
  }

  setTimeout(function () {
    isHint = false;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
      if (i < 0 || i >= gBoard.length) continue;
      for (var j = cellJ - 1; j <= cellJ + 1; j++) {
        if (j < 0 || j >= gBoard[i].length) continue;

        document.querySelector(`.cell-${i}-${j}`).innerText =
          gBoard[i][j].minesAroundCount;
        document.querySelector(`.cell-${i}-${j}`).classList.remove('pressed');
        renderBoard(gBoard);
      }
    }
  }, 1500);
}

function safeClick() {
  var elSafe = document.querySelector('.safe-click');
  gSafeClick--;
  cellIsShownAmount++;

  if (gSafeClick === 2 && !gClickCounter) startTimer();

  if (gSafeClick === 2) elSafe.innerText = '👆 👆';
  if (gSafeClick === 1) elSafe.innerText = '👆';
  if (gSafeClick === 0) elSafe.innerText = '';
  isSafeClick = true;

  findSafeCell();
}

function findSafeCell() {
  ++gClickCounter;

  var safeCells = [];
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (!gBoard[i][j].isMine && !gBoard[i][j].isShown)
        safeCells.push({ i: i, j: j });
    }
  }
  var randomIdx = getRandomInt(0, safeCells.length);
  var RandomPos = safeCells[randomIdx];

  gBoard[RandomPos.i][RandomPos.j].isShown = true;

  if (!gBoard[RandomPos.i][RandomPos.j].minesAroundCount) {
    showExpendedNums(RandomPos.i, RandomPos.j);
  }

  renderBoard(gBoard);

  isSafeClick = false;
}

function howManyCellShown() {
  cellIsShownAmount = 1;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isShown && !gBoard[i][j].isMine) cellIsShownAmount++;
      // if (gBoard[i][j].isShown) cellIsShownAmount++;
    }
  }
}
