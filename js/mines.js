function getMines(board, minesAmount) {
  for (var i = 0; i < minesAmount; i++) {
    var mineI = getRandomInt(0, board.length);
    var mineJ = getRandomInt(0, board[0].length);

    if (!gBoard[mineI][mineJ].isMine) {
      gBoard[mineI][mineJ].isMine = true;
    } else {
      i--;
    }
  }
}
