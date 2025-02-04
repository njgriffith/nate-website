const minesweeperWindow = document.getElementById('minesweeper-window');
const msDifficulty = document.getElementById('ms-difficulty');
const msFace = document.getElementById('minesweeper-face');
const timer = document.getElementById('timer');
const timerDigits = document.querySelectorAll('#timer>img');
const flagsLeft = document.getElementById('flags-left');
const flagDigits = document.querySelectorAll('#flags-left>img');

var gameGrid = [];
let seconds = 0;
let thousandSecond = 0;
let gameOver = false;
var rows = 8;
var cols = 10;
var totalBombs = 10;
var intervalTracker;
var numFlagsLeft = 10;
var hasPlacedYet = false;

// playMinesweeper();
function closeMinesweeper(){
    hasPlacedYet = false;
    if (document.getElementById('minesweeper-table') !== null) {
        clearInterval(intervalTracker);
        document.getElementById('minesweeper-table').remove();
    }
}
function playMinesweeper() {
    hasPlacedYet = false;
    if (document.getElementById('minesweeper-table') !== null) {
        clearInterval(intervalTracker);
        document.getElementById('minesweeper-table').remove();
    }
    gameOver = false;
    seconds = 998;
    thousandSecond = 0;
    const difficulty = msDifficulty.value;
    if (difficulty.includes('Choose')) {
        alert('Choose a difficulty');
        return;
    }
    if (difficulty === 'Easy') {
        rows = 8;
        cols = 10;
        totalBombs = 10;
    }
    if (difficulty === 'Medium') {
        rows = 16;
        cols = 16;
        totalBombs = 40;
    }
    else if (difficulty === 'Hard') {
        rows = 30;
        cols = 16;
        totalBombs = 99;
    }
    numFlagsLeft = totalBombs;
    createGrid();
    placeBombs(totalBombs);
    timerDigits.forEach(timerDigit => {
        timerDigit.src = 'resources/minesweeper/0.png'
    });
    flagDigits[0].src = 'resources/minesweeper/0.png';
    flagDigits[1].src = `resources/minesweeper/${Math.floor(totalBombs / 10)}.png`;
    flagDigits[2].src = `resources/minesweeper/${totalBombs % 10}.png`;

    intervalTracker = setInterval(() => {
        seconds++;
        if (seconds === 1000){
            thousandSecond++;
            seconds = 0;
            timerDigits[0].src = `resources/minesweeper/0.png`;
            timerDigits[1].src = `resources/minesweeper/0.png`;
            timerDigits[2].src = `resources/minesweeper/0.png`;
        }
        if (seconds < 10) {
            timerDigits[2].src = `resources/minesweeper/${seconds}.png`;
        }
        else if (seconds < 100) {
            timerDigits[1].src = `resources/minesweeper/${Math.floor(seconds / 10)}.png`;
            timerDigits[2].src = `resources/minesweeper/${seconds % 10}.png`;
        }
        else {
            timerDigits[0].src = `resources/minesweeper/${Math.floor(seconds / 100)}.png`;
            timerDigits[1].src = `resources/minesweeper/${Math.floor(seconds / 10) % 10}.png`;
            timerDigits[2].src = `resources/minesweeper/${seconds % 100 % 10}.png`;
        }
    }, 1000);
}

function createGrid() {
    const gameTable = document.createElement('table');
    gameTable.id = 'minesweeper-table';
    gameTable.style.gap = '0';
    const container = document.createElement('tbody');
    container.addEventListener('mousedown', (event) => {
        msFace.src = 'resources/minesweeper/stress.png';
    });
    container.addEventListener('mouseup', (event) => {
        if (!gameOver) {
            msFace.src = 'resources/minesweeper/smile.png';
        }
    });
    container.addEventListener('mouseleave', (event) => {
        if (!gameOver) {
            msFace.src = 'resources/minesweeper/smile.png';
        }
    });
    container.id = 'minesweeper-container';
    for (let i = 0; i < rows; i++) {
        gameGrid[i] = [];
        const tempRow = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('td');
            cell.id = `cell-${i}-${j}`
            cell.addEventListener("click", () => revealCell(i, j));
            cell.addEventListener("contextmenu", (event) => {
                event.preventDefault();
                toggleFlag(i, j);
            });
            const cellImg = document.createElement('img');
            cellImg.src = '/resources/minesweeper/tile.png';
            cell.appendChild(cellImg);
            cell.classList.add('minesweeper-cell');
            tempRow.appendChild(cell);
            gameGrid[i][j] = { element: cell, mine: false, revealed: false, flagged: false, count: 0 };
        }
        container.appendChild(tempRow);
    }
    gameTable.appendChild(container);
    minesweeperWindow.appendChild(gameTable);
}

function placeBombs(totalBombs) {
    let minesPlaced = 0;
    while (minesPlaced < totalBombs) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (!gameGrid[r][c].mine) {
            gameGrid[r][c].mine = true;
            minesPlaced++;
        }
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!gameGrid[i][j].mine) {
                gameGrid[i][j].count = countMines(i, j);
            }
        }
    }
}

function countMines(row, col) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            let nr = row + dr;
            let nc = col + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && gameGrid[nr][nc].mine) {
                count++;
            }
        }
    }
    return count;
}

function revealCell(row, col) {
    if (gameOver || gameGrid[row][col].revealed || gameGrid[row][col].flagged) return;

    let cell = gameGrid[row][col];
    cell.revealed = true;

    if(!hasPlacedYet && (cell.count > 0 || cell.mine)){
        closeMinesweeper();
        playMinesweeper();
        revealCell(row, col);
        return;
    }
    if (cell.mine) {
        document.querySelector(`#cell-${row}-${col}>img`).src = '/resources/minesweeper/tile-mine-hit.png';
        gameOver = true;
        msFace.src = '/resources/minesweeper/dead.png';
        clearInterval(intervalTracker);
        revealAllMines();
        alert("Game Over! You hit a mine.");
        return;
    }
    hasPlacedYet = true;

    if (cell.count > 0) {
        document.querySelector(`#cell-${row}-${col}>img`).src = `/resources/minesweeper/near-${cell.count}.png`;
    } else {
        // Reveal surrounding empty cells
        document.querySelector(`#cell-${row}-${col}>img`).src = `/resources/minesweeper/tile-clear.png`;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                let nr = row + dr;
                let nc = col + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    revealCell(nr, nc);
                }
            }
        }
    }
    checkWin();
}

function toggleFlag(row, col) {
    if (gameOver || gameGrid[row][col].revealed) return;

    let cell = gameGrid[row][col];
    if (!cell.flagged && numFlagsLeft === 0) {
        return
    }
    cell.flagged = !cell.flagged;
    document.querySelector(`#cell-${row}-${col}>img`).src = cell.flagged ? `/resources/minesweeper/tile-flag.png` : `/resources/minesweeper/tile.png`;
    if (cell.flagged) {
        numFlagsLeft--;
    }
    else {
        numFlagsLeft++;
    }
    flagDigits[0].src = 'resources/minesweeper/0.png';
    flagDigits[1].src = `resources/minesweeper/${Math.floor(numFlagsLeft / 10)}.png`;
    flagDigits[2].src = `resources/minesweeper/${numFlagsLeft % 10}.png`;
}

function revealAllMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (gameGrid[r][c].mine) {
                if (!document.querySelector(`#cell-${r}-${c}>img`).src.includes('hit')) {
                    document.querySelector(`#cell-${r}-${c}>img`).src = `/resources/minesweeper/tile-mine.png`;
                }
            }
            else if (gameGrid[r][c].flagged && !gameGrid[r][c].mine) {
                document.querySelector(`#cell-${r}-${c}>img`).src = `/resources/minesweeper/tile-mine-wrong.png`;
            }
        }
    }
}

function checkWin() {
    if (gameOver) return;
    let revealedCells = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (gameGrid[r][c].revealed) {
                revealedCells++;
            }
        }
    }
    if (revealedCells === rows * cols - totalBombs) {
        msFace.src = 'resources/minesweeper/cool.png';
        clearInterval(intervalTracker);
        gameOver = true;
        var username = prompt("Congratulations! Enter your name to join the leaderboards");
        updateLeaderboard(username, seconds + (thousandSecond * 1000));
    }
}

async function updateLeaderboard(username, score) {
    try {
        const difficulty = msDifficulty.value;
        console.log(JSON.stringify({ username, score, difficulty }));
        const response = await fetch('https://api.nate-griffith.com/minesweeper', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, score, difficulty }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('posted to leaderboard!');
        }
        else {
            alert('error posting to leaderboard');
        }
    }
    catch (error) {
        alert('error connecting to service');
        console.error(error);
    }
}

async function getLeaderboard() {
    if (document.getElementById('leaderboard').querySelector('li')) return;
    try {
        const response = await fetch('https://api.nate-griffith.com/minesweeper', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        if (response.ok) {
            const easyBoard = document.querySelector('#leaderboard-easy>ol');
            const mediumBoard = document.querySelector('#leaderboard-medium>ol');
            const hardBoard = document.querySelector('#leaderboard-hard>ol');
            data[0].forEach(entry => {
                const tempEntry = document.createElement('li');
                tempEntry.innerText = Object.keys(entry)[0] + ": " + Object.values(entry)[0];
                easyBoard.appendChild(tempEntry);
            });
            data[1].forEach(entry => {
                const tempEntry = document.createElement('li');
                tempEntry.innerText = Object.keys(entry)[0] + ": " + Object.values(entry)[0];
                mediumBoard.appendChild(tempEntry);
            });
            data[2].forEach(entry => {
                const tempEntry = document.createElement('li');
                tempEntry.innerText = Object.keys(entry)[0] + ": " + Object.values(entry)[0];
                hardBoard.appendChild(tempEntry);
            });
        }
        else {
            alert('error fetching leaderboard');
        }
    }
    catch (error) {
        alert('error connecting to service');
        console.error(error);
    }
}

msFace.addEventListener('mousedown', (event) => {
    if (!gameOver) {
        msFace.src = 'resources/minesweeper/smile-press.png';
    }
});
msFace.addEventListener('mouseleave', (event) => {
    if (!gameOver) {
        msFace.src = 'resources/minesweeper/smile.png';
    }
});
msFace.addEventListener('mouseup', (event) => {
    msFace.src = 'resources/minesweeper/smile.png';
    playMinesweeper();
});

