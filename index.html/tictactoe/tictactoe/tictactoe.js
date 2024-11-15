const cells = document.querySelectorAll('.cell');
const statusMessage = document.getElementById('status-message');
const resetButton = document.getElementById('reset-button');
const gameModeSelect = document.getElementById('game-mode');
const difficultyContainer = document.getElementById('difficulty-container');
const difficultySelect = document.getElementById('difficulty');

let currentPlayer = 'X'; // Player X starts the game
let gameActive = true; // Game is active by default
let board = Array(9).fill(null); // Initial empty game board
let gameMode = 'vsComputer'; // Default game mode
let difficulty = 'Medium'; // Default difficulty level

// Winning combinations
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Function to handle cell clicks
function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = cell.getAttribute('data-index');

    // Ignore clicks if cell is already taken or game is over
    if (board[cellIndex] || !gameActive) return;

    // Player's move
    board[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('taken');

    // Check for winner or draw
    if (checkWinner()) {
        statusMessage.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    } else if (board.every(cell => cell)) {
        statusMessage.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    // Switch turns based on game mode
    if (gameMode === '2v2') {
        // Switch to the other player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusMessage.textContent = `Player ${currentPlayer}'s turn`;
    } else if (gameMode === 'vsComputer') {
        // Computer's turn
        currentPlayer = 'O';
        statusMessage.textContent = "Computer's turn";
        setTimeout(computerMove, 500); // Delay for better UX
    }
}

// Computer move logic
function computerMove() {
    if (!gameActive) return;

    let move;
    if (difficulty === 'Easy') {
        move = randomMove();
    } else if (difficulty === 'Medium') {
        move = blockOrRandomMove();
    } else if (difficulty === 'Hard') {
        move = getBestMove();
    }

    // Make the move
    board[move] = 'O';
    cells[move].textContent = 'O';
    cells[move].classList.add('taken');

    // Check for winner or draw
    if (checkWinner()) {
        statusMessage.textContent = "Computer wins!";
        gameActive = false;
    } else if (board.every(cell => cell)) {
        statusMessage.textContent = "It's a draw!";
        gameActive = false;
    } else {
        currentPlayer = 'X';
        statusMessage.textContent = "Player X's turn";
    }
}

// Easy: Random move
function randomMove() {
    const availableMoves = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Medium: Block or random move
function blockOrRandomMove() {
    for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] === 'X' && board[b] === 'X' && !board[c]) return c;
        if (board[a] === 'X' && board[c] === 'X' && !board[b]) return b;
        if (board[b] === 'X' && board[c] === 'X' && !board[a]) return a;
    }
    return randomMove();
}

// Hard: Minimax algorithm
function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = 'O';
            const score = minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    if (checkWinnerAI('O')) return 10 - depth;
    if (checkWinnerAI('X')) return depth - 10;
    if (board.every(cell => cell)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                const score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                const score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Check for AI winner
function checkWinnerAI(player) {
    return winningCombos.some(combo => combo.every(index => board[index] === player));
}

// Check for winner
function checkWinner() {
    return winningCombos.some(combo => combo.every(index => board[index] === currentPlayer));
}

// Reset the game
function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    statusMessage.textContent = "Player X's turn";
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken');
    });
}

// Handle game mode change
gameModeSelect.addEventListener('change', () => {
    gameMode = gameModeSelect.value;
    difficultyContainer.classList.toggle('hidden', gameMode !== 'vsComputer');
    resetGame();
});

// Handle difficulty change
difficultySelect.addEventListener('change', (event) => {
    difficulty = event.target.value;
});

// Add event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

const xColorPicker = document.getElementById('x-color');
const oColorPicker = document.getElementById('o-color');

let xColor = xColorPicker.value; // Default X color
let oColor = oColorPicker.value; // Default O color

// Update the colors when the player changes them
xColorPicker.addEventListener('input', (event) => {
    xColor = event.target.value;
});

oColorPicker.addEventListener('input', (event) => {
    oColor = event.target.value;
});

// Update the handleCellClick function to use the selected colors
function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = cell.getAttribute('data-index');

    // Ignore clicks if cell is already taken or game is over
    if (board[cellIndex] || !gameActive) return;

    // Player's move
    board[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.style.color = currentPlayer === 'X' ? xColor : oColor; // Apply selected color
    cell.classList.add('taken');

    // Check for winner or draw
    if (checkWinner()) {
        statusMessage.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    } else if (board.every(cell => cell)) {
        statusMessage.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    // Switch turns based on game mode
    if (gameMode === '2v2') {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusMessage.textContent = `Player ${currentPlayer}'s turn`;
    } else if (gameMode === 'vsComputer') {
        currentPlayer = 'O';
        statusMessage.textContent = "Computer's turn";
        setTimeout(computerMove, 500);
    }
}

// Reset game to clear the colors and styles
function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    statusMessage.textContent = "Player X's turn";
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.color = ''; // Reset color
        cell.classList.remove('taken');
    });
}
