const grid = document.getElementById('game-grid');
const rows = 20;
const cols = 10;
const gridArray = [];

// Tetromino shapes
const tetrominoes = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]], // Z
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1, 1], [1, 0, 0]], // L
    [[1, 1, 1], [0, 0, 1]], // J
];

let currentTetromino = null;
let position = { x: 4, y: 0 };
let intervalId;

// Create grid
function createGrid() {
    for (let y = 0; y < rows; y++) {
        const row = [];
        for (let x = 0; x < cols; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            grid.appendChild(cell);
            row.push(cell);
        }
        gridArray.push(row);
    }
}

// Draw tetromino
function drawTetromino() {
    currentTetromino.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell) {
                const x = position.x + colIndex;
                const y = position.y + rowIndex;
                if (gridArray[y] && gridArray[y][x]) {
                    gridArray[y][x].classList.add('active');
                }
            }
        });
    });
}

// Clear tetromino
function clearTetromino() {
    document.querySelectorAll('.active').forEach(cell => cell.classList.remove('active'));
}

// Move tetromino
function moveTetromino(direction) {
    clearTetromino();
    console.log(position.x);
    if (direction === 'down') position.y++;
    if (direction === 'left') position.x--;
    if (direction === 'right') position.x++;
    drawTetromino();
}

// Drop tetromino
function dropTetromino() {
    clearTetromino();
    position.y++;
    if (!isValidPosition()) {
        position.y--;
        fixTetromino();
        spawnTetromino();
    }
    drawTetromino();
}

// Fix tetromino in place
function fixTetromino() {
    currentTetromino.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell) {
                const x = position.x + colIndex;
                const y = position.y + rowIndex;
                if (gridArray[y] && gridArray[y][x]) {
                    gridArray[y][x].classList.add('fixed');
                }
            }
        });
    });
}

// Check valid position
function isValidPosition() {
    return currentTetromino.shape.every((row, rowIndex) =>
        row.every((cell, colIndex) => {
            if (!cell) return true;
            const x = position.x + colIndex;
            const y = position.y + rowIndex;
            return y >= 0 && y < rows && x >= 0 && x < cols && !gridArray[y][x]?.classList.contains('fixed');
        })
    );
}

// Spawn new tetromino
function spawnTetromino() {
    position = { x: 4, y: 0 };
    const randomIndex = Math.floor(Math.random() * tetrominoes.length);
    currentTetromino = { shape: tetrominoes[randomIndex] };
    if (!isValidPosition()) {
        clearInterval(intervalId);
        alert('Game Over');
    }
    drawTetromino();
}

// Keyboard controls
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') dropTetromino();
    if (e.key === 'ArrowLeft') moveTetromino('left');
    if (e.key === 'ArrowRight') moveTetromino('right');
});

// Initialize game
function startGame() {
    createGrid();
    spawnTetromino();
    intervalId = setInterval(dropTetromino, 200);
}

