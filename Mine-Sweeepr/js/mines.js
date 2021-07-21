function getMinesPos(board, minesAmount) {
  var minesPositions = [];
  for (var i = 0; i < minesAmount; i++) {
    var randomI = getRandomInt(0, board.length);
    var randomj = getRandomInt(0, board.length);

    minesPositions.push({ i: randomI, j: randomj });
  }
  return minesPositions;
}

function renderMines(minesLocation) {
  for (var i = 0; i < minesLocation.length; i++) {
    var mineI = minesLocation[i].i;
    var mineJ = minesLocation[i].j;

    gBoard[mineI][mineJ].isMine = true;
    renderBoard(gBoard);
  }
}
