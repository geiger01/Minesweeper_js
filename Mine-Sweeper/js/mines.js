function getMines(board, minesAmount) {
  // var minesPositions = [];
  for (var i = 0; i < minesAmount; i++) {
    var mineI = getRandomInt(0, board.length);
    var mineJ = getRandomInt(0, board[0].length);

    // minesPositions.push({ i: randomI, j: randomj });
    if (!gBoard[mineI][mineJ].isMine) {
      gBoard[mineI][mineJ].isMine = true;
    } else {
      i--;
    }
  }
  // return minesPositions;
}

// function renderMines(minesLocation) {
//   for (var i = 0; i < minesLocation.length; i++) {
//     var mineI = minesLocation[i].i;
//     var mineJ = minesLocation[i].j;

//   }

//   renderBoard(gBoard);
// }
