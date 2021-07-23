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

function resetMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine) gBoard[i][j].isMine = false;
    }
  }
}

function getMinesAdmin(mineI, mineJ) {
  gBoard[mineI][mineJ].isMine = true;
  renderBoard(gBoard);
}

function adminMode() {
  document.querySelector('.admin button').classList.toggle('adminPressed');
  gAdminMode = gAdminMode ? false : true;

  if (!gAdminMode && gAdminClickCounter !== 0) init();

  if (gAdminMode && gClickCounter !== 0) {
    init();
    gAdminMode = true;
  }
}
