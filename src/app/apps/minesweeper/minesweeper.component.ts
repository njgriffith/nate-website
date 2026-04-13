import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-minesweeper',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './minesweeper.component.html',
  styleUrl: './minesweeper.component.css'
})
export class MinesweeperComponent {
  username: string = '';
  password: string = '';
  isLoggedIn: boolean = false;
  difficulty: string = 'Easy';
  isLeaderboardOpen: boolean = false;
  isPromptForLoginOpen: boolean = false;
  isPlaying: boolean = false;
  seconds: number = 0;
  thousandSecond: number = 0;
  timerDigits: string[] = ['-', '-', '-'];
  flagDigits: string[] = ['-', '-', '-'];
  rows: number = 0;
  cols: number = 0;
  totalBombs: number = 10;
  timeTracker: any = null;
  numFlagsLeft: number = 10;
  hasPlacedYet: boolean = false;
  gameGrid: any[] = [];
  gameOver: boolean = false;
  faceImg: string = 'assets/minesweeper/smile.png';
  leaderboardData: any = [];
  difficululties: string[] = ['easy', 'medium', 'hard', 'expert', 'master'];

  constructor(private apiService: ApiService, private userService: UserService) { }

  ngOnInit() {
    this.userService.user$.subscribe((user) => {
      this.username = user.username !== 'guest' ? user.username : '';
      this.password = user.password;
      this.isLoggedIn = user.isLoggedIn;
    });
  }

  getLeaderboardDataBackend() {
    this.apiService.getMSLeaderboard().subscribe((response) => {
      this.leaderboardData = response;
    });
  }

  playMinesweeper() {
    this.seconds = 0;
    this.thousandSecond = 0;
    this.hasPlacedYet = false;
    this.gameOver = false;

    if (this.difficulty === 'Easy') {
      this.rows = 8;
      this.cols = 10;
      this.totalBombs = 10;
    }
    else if (this.difficulty === 'Medium') {
      this.rows = 16;
      this.cols = 16;
      this.totalBombs = 40;
    }
    else if (this.difficulty === 'Hard') {
      this.rows = 30;
      this.cols = 16;
      this.totalBombs = 99;
    }
    else if (this.difficulty === 'Expert') {
      this.rows = 30;
      this.cols = 32;
      this.totalBombs = 198;
    }
    else if (this.difficulty === 'Master') {
      this.rows = 30;
      this.cols = 64;
      this.totalBombs = 396;
    }
    else {
      alert('Choose a difficulty');
      return;
    }
    this.numFlagsLeft = this.totalBombs;

    if (this.numFlagsLeft < 100) {
      this.flagDigits[0] = `${Math.floor(this.numFlagsLeft / 100)}`;
      this.flagDigits[1] = `${Math.floor(this.numFlagsLeft / 10)}`;
      this.flagDigits[2] = `${this.numFlagsLeft % 10}`;
    }
    else {
      this.flagDigits[0] = `${Math.floor(this.numFlagsLeft / 100)}`;
      this.flagDigits[1] = `${Math.floor(this.numFlagsLeft / 10) % 10}`;
      this.flagDigits[2] = `${this.numFlagsLeft % 100 % 10}`;
    }


    this.timerDigits = ['0', '0', '0'];

    this.createGrid();
    this.placeBombs();
    this.isPlaying = true;
  }

  createGrid() {
    for (let i = 0; i < this.rows; i++) {
      this.gameGrid[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.gameGrid[i][j] = { mine: false, revealed: false, flagged: false, count: 0, img: 'tile' };
      }
    }
  }

  placeBombs() {
    let minesPlaced = 0;
    while (minesPlaced < this.totalBombs) {
      let r = Math.floor(Math.random() * this.rows);
      let c = Math.floor(Math.random() * this.cols);
      if (!this.gameGrid[r][c].mine) {
        this.gameGrid[r][c].mine = true;
        minesPlaced++;
      }
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (!this.gameGrid[i][j].mine) {
          this.gameGrid[i][j].count = this.countMines(i, j);
        }
      }
    }
  }

  countMines(row: number, col: number) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        let nr = row + dr;
        let nc = col + dc;
        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.gameGrid[nr][nc].mine) {
          count++;
        }
      }
    }
    return count;
  }

  revealCell(row: number, col: number) {
    const cell = this.gameGrid[row][col];
    if (this.gameOver || cell.revealed || cell.flagged) return;

    cell.revealed = true;

    if (!this.hasPlacedYet && (cell.count > 0 || cell.mine)) {
      this.closeMinesweeper();
      this.playMinesweeper();
      this.revealCell(row, col);
      return;
    }
    if (!this.hasPlacedYet) {
      this.timeTracker = setInterval(() => {
        this.seconds++;
        if (this.seconds === 1000) {
          this.thousandSecond++;
          this.seconds = 0;
          this.timerDigits = ['0', '0', '0'];
        }
        if (this.seconds < 10) {
          this.timerDigits[2] = `${this.seconds}`;
        }
        else if (this.seconds < 100) {
          this.timerDigits[1] = `${Math.floor(this.seconds / 10)}`;
          this.timerDigits[2] = `${this.seconds % 10}`;
        }
        else {
          this.timerDigits[0] = `${Math.floor(this.seconds / 100)}`;
          this.timerDigits[1] = `${Math.floor(this.seconds / 10) % 10}`;
          this.timerDigits[2] = `${this.seconds % 100 % 10}`;
        }
      }, 1000);
    }

    if (cell.mine) {
      cell.img = 'tile-mine-hit';
      this.gameOver = true;
      this.faceImg = 'assets/minesweeper/dead.png';
      clearInterval(this.timeTracker);
      this.revealAllMines();
      alert("Game Over! You hit a mine.");
      return;
    }
    this.hasPlacedYet = true;

    if (cell.count > 0) {
      cell.img = `near-${cell.count}`;
    }
    else {
      // Reveal surrounding empty cells
      cell.img = 'tile-clear';
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          let nr = row + dr;
          let nc = col + dc;
          if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
            this.revealCell(nr, nc);
          }
        }
      }
    }
    this.checkWin();
  }

  toggleFlag(row: number, col: number) {
    const cell = this.gameGrid[row][col];
    if (this.gameOver || cell.revealed) return;

    if (!cell.flagged && this.numFlagsLeft === 0) {
      return
    }
    cell.flagged = !cell.flagged;
    cell.img = cell.flagged ? 'tile-flag' : 'tile';
    if (cell.flagged) {
      this.numFlagsLeft--;
    }
    else {
      this.numFlagsLeft++;
    }

    if (this.numFlagsLeft < 100) {
      this.flagDigits[0] = `${Math.floor(this.numFlagsLeft / 100)}`;
      this.flagDigits[1] = `${Math.floor(this.numFlagsLeft / 10)}`;
      this.flagDigits[2] = `${this.numFlagsLeft % 10}`;
    }
    else {
      this.flagDigits[0] = `${Math.floor(this.numFlagsLeft / 100)}`;
      this.flagDigits[1] = `${Math.floor(this.numFlagsLeft / 10) % 10}`;
      this.flagDigits[2] = `${this.numFlagsLeft % 100 % 10}`;
    }
  }

  revealAllMines() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.gameGrid[r][c].mine) {
          if (!this.gameGrid[r][c].img.includes('hit')) {
            this.gameGrid[r][c].img = 'tile-mine';
          }
        }
        else if (this.gameGrid[r][c].flagged && !this.gameGrid[r][c].mine) {
          this.gameGrid[r][c].img = 'tile-mine-wrong';
        }
      }
    }
  }

  checkWin() {
    if (this.gameOver) return;
    let revealedCells = 0;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.gameGrid[r][c].revealed) {
          revealedCells++;
        }
      }
    }
    if (revealedCells === this.rows * this.cols - this.totalBombs) {
      this.faceImg = 'assets/minesweeper/cool.png';
      clearInterval(this.timeTracker);
      this.gameOver = true;
      let score: number = this.seconds + (this.thousandSecond * 1000);
      if (!this.isLoggedIn) {
        // prompt user to log in
      }
      else {
        this.updateLeaderboard(score);
      }
    }
  }

  updateLeaderboard(score: number) {
    alert(`Congratulations ${this.username}! Updating leaderboards...`);
    this.apiService.updateMSLeaderboard(this.username, this.password, score, this.difficulty).subscribe((response: any) => {
      console.log('MS response: ', response);
    });
  }

  toggleLeaderboard() {
    this.isLeaderboardOpen = !this.isLeaderboardOpen;
    if (this.isLeaderboardOpen) {
      this.getLeaderboardDataBackend();
    }
  }

  faceMouseDown() {
    if (!this.gameOver) {
      this.faceImg = 'assets/minesweeper/smile-press.png';
    }
  }
  faceMouseLeave() {
    if (!this.gameOver) {
      this.faceImg = 'assets/minesweeper/smile.png';
    }
  }
  faceMouseUp() {
    this.faceImg = 'assets/minesweeper/smile.png';
    this.playMinesweeper();
  }

  handleFaceImage(img: string) {
    if (this.gameOver) return;
    this.faceImg = `assets/minesweeper/${img}.png`
  }

  closeMinesweeper() {
    this.hasPlacedYet = false;
    clearInterval(this.timeTracker);
    this.isPlaying = false;
    this.gameGrid = [];
  }

  ngOnDestroy() {
    this.closeMinesweeper();
  }
}
