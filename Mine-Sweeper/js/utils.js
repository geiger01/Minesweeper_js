function makeMat(rows, cols) {
  var mat = [];

  for (var i = 0; i < rows; i++) {
    mat[i] = [];

    for (var j = 0; j < cols; j++) {
      mat[i][j] = {
        minesAroundCount: 0,
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

function rulesPopup() {
  alert(
    'The number on a block shows the number of mines adjacent to it and you have to flag all the mines.'
  );
}
