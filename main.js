let title = document.querySelector('.title');
let board = Array(10).fill('');
let human = 'X';
let comp = 'O';

function checkWinner(b) {
  const wins = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];

  // check  any wining from previous wins array

  for (let [a, b1, c] of wins) {
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
      return b[a];
    }
  }

  // check if there is no box empty return tie

  if (b.slice(1).every((v) => v !== '')) return 'tie';

  // return null if no winner
  return null;
}

// end game and display winner
function endGame(winnerCombo) {
  title.innerHTML = `${board[winnerCombo[0]]} is winner`;

  // Highlight the winner combination
  for (let i of winnerCombo) {
    document.getElementById('item' + i).style.background = '#000';
  }

  // add  .. and reload
  setInterval(() => (title.innerHTML += '.'), 1000);
  setTimeout(() => location.reload(), 4000);
}

// get All Empty Squares
function getEmptySquares(b) {
  return b.map((v, i) => (i !== 0 && v === '' ? i : null)).filter((v) => v);
}

// minimax function
function minimax(newBoard, depth, isMaximizing) {
  //check the winner and set score
  let result = checkWinner(newBoard);
  if (result === human) return { score: -10 + depth };
  if (result === comp) return { score: 10 - depth };
  if (result === 'tie') return { score: 0 };

  let best;

  // if it's maximizing try to find best move
  if (isMaximizing) {
    best = { score: -Infinity };
    for (let i of getEmptySquares(newBoard)) {
      newBoard[i] = comp;
      let sim = minimax(newBoard, depth + 1, false);
      newBoard[i] = '';
      if (sim.score > best.score) {
        best = { score: sim.score, index: i };
      }
    }
  } else {
    // If the player is minimizing , try to block them
    best = { score: Infinity };
    for (let i of getEmptySquares(newBoard)) {
      newBoard[i] = human;
      let sim = minimax(newBoard, depth + 1, true);
      newBoard[i] = '';
      if (sim.score < best.score) {
        best = { score: sim.score, index: i };
      }
    }
  }
  return best;
}

// computer move
function compMove() {
  let move = minimax([...board], 0, true).index; // get the best move
  if (move) {
    board[move] = comp;
    document.getElementById('item' + move).innerHTML = comp;
    title.innerHTML = 'X';
    let result = checkWinner(board);
    if (result === comp) endGame([move]);
    else if (result === 'tie') {
      title.innerHTML = "It's a tie!";
      setTimeout(() => location.reload(), 3000);
    }
  }
}

// player move
function playerMove(id) {
  if (board[id] === '') {
    board[id] = human;
    document.getElementById('item' + id).innerHTML = human;
    title.innerHTML = 'O';

    let result = checkWinner(board);
    if (result === human) {
      endGame([id]);
    } else if (result === 'tie') {
      title.innerHTML = "It's a tie!";
      setTimeout(() => location.reload(), 3000);
    } else {
      setTimeout(compMove, 500);
    }
  }
}
