import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { User, UserService } from '../../services/user.service';
import { NgFor, NgIf } from '@angular/common';
import { AppService } from '../../services/app.service';

interface Mine {
  grid: Cell[][];
  goldLeft: number;
  level: number;
}

interface Cell {
  isMined: boolean;
  isRevealed: boolean;
  hasCoin: boolean;
  hasPlayer: boolean;
}

interface EmployeeState {
  posX: number;
  posY: number;
  fuel: number;
  speed: number;
  level: number;
  mineLevel: number;
  direction: 'forward' | 'backward';
  mineIndex: number;
  intervalId?: number;
}

@Component({
  selector: 'app-mine-nate-coin',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './mine-nate-coin.component.html',
  styleUrl: './mine-nate-coin.component.css'
})
export class MineNateCoinComponent implements OnDestroy {
  username: string = '';
  balance: number = 0;
  isLoggedIn: boolean = false;

  coinsMined: number = 0;
  playerX: number = 0;
  playerY: number = 5;
  miningTools: Record<string, any> = {};
  employees: number[] = [0, 0, 0, 0, 0];
  oreDetector: number = 0;
  maxFuel: number = 1000;
  fuelLevel: number = this.maxFuel;

  mines: Mine[] = [];
  employeeStates: EmployeeState[] = [];
  mineWidth: number = 60;
  mineHeight: number = 11;

  legend: Record<string, string>[] = [
    { label: 'Player', class: 'player' },
    { label: 'Nate Coin', class: 'coin' },
    { label: 'Ore detection range', class: 'detecting' },
    { label: 'Mined', class: 'mined' },
    { label: 'Unknown', class: 'mine-cell' }
  ];

  employeeCosts: number[] = [50, 100, 150, 200, 250];
  employeeFuel: number[] = [250, 500, 1000, 2500, 5000];
  employeeSpeeds: number[] = [500, 500, 400, 250, 100];

  oreDetectorCosts: number[] = [100, 200, 300, 400, 500];

  showUpgradeMenu: boolean = false;

  @ViewChild('userMine', { static: true }) userMine!: ElementRef<HTMLElement>;
  focused: boolean = false;

  constructor(private userService: UserService, private appService: AppService) { }

  ngOnInit() {
    this.userService.user$.subscribe((user: User) => {
      this.username = user.username;
      this.balance = user.balance;
      this.isLoggedIn = user.isLoggedIn;
      this.miningTools = user.miningTools;

      if (this.isLoggedIn) {
        this.employees = [...(this.miningTools['employees'] ?? [0, 0, 0, 0, 0])];
        this.oreDetector = this.miningTools['ore_detector'] ?? 0;
      } else {
        this.employees = [0, 0, 0, 0, 0];
        this.oreDetector = 0;
      }

      this.resetMinesAndEmployees();
      this.initializeMainMine();

      for (let i = 0; i < this.employees.length; i++) {
        if (this.employees[i] > 0) {
          this.initializeEmployee(i);
        }
      }
    });
  }

  ngOnDestroy() {
    this.clearEmployeeIntervals();
  }

  private resetMinesAndEmployees() {
    this.clearEmployeeIntervals();
    this.employeeStates = [];
    this.mines = [];
  }

  private clearEmployeeIntervals() {
    this.employeeStates.forEach((state) => {
      if (state.intervalId !== undefined) {
        clearInterval(state.intervalId);
        state.intervalId = undefined;
      }
    });
  }

  private initializeMainMine() {
    this.mines.push(this.createMine(1));
    this.mines[0].grid[this.playerY][this.playerX] = {
      isMined: true,
      isRevealed: true,
      hasCoin: false,
      hasPlayer: true
    };
    this.revealSurroundingCells();
  }

  private initializeEmployee(index: number) {
    const level = this.employees[index];
    const state: EmployeeState = {
      posX: 0,
      posY: 0,
      fuel: this.employeeFuel[level - 1],
      speed: this.employeeSpeeds[level - 1],
      level,
      mineLevel: 1,
      direction: 'forward',
      mineIndex: index + 1
    };

    this.employeeStates[index] = state;
    const employeeMine = this.createMine(1);
    employeeMine.grid[0][0] = {
      isMined: true,
      isRevealed: true,
      hasCoin: false,
      hasPlayer: true
    };
    this.mines[index + 1] = employeeMine;

    this.startEmployee(index);
  }

  private startEmployee(index: number) {
    const state = this.employeeStates[index];
    if (!state || state.level <= 0) {
      return;
    }

    if (state.intervalId !== undefined) {
      clearInterval(state.intervalId);
    }

    state.intervalId = window.setInterval(() => this.moveEmployee(index), state.speed);
  }

  private stopEmployee(index: number) {
    const state = this.employeeStates[index];
    if (!state) {
      return;
    }

    if (state.intervalId !== undefined) {
      clearInterval(state.intervalId);
      state.intervalId = undefined;
    }
  }

  refuelEmployee(index: number) {
    const state = this.employeeStates[index];
    if (!state) {
      return;
    }

    state.fuel = this.employeeFuel[state.level - 1];
    // reset back to start
    this.resetEmployeeMine(index, 1);
    this.startEmployee(index);
  }

  private moveEmployee(index: number) {
    const state = this.employeeStates[index];
    if (!state || state.fuel <= 0) {
      this.stopEmployee(index);
      return;
    }

    const mine = this.mines[state.mineIndex];
    if (!mine) {
      this.stopEmployee(index);
      return;
    }

    const prevCell = mine.grid[state.posY][state.posX];
    prevCell.hasPlayer = false;
    prevCell.isMined = true;

    const width = mine.grid[0].length;
    const height = mine.grid.length;

    if (state.posY % 2 === 0) {
      state.direction = 'forward';
      if (state.posX < width - 1) {
        state.posX++;
      } else if (state.posY < height - 1) {
        state.posY++;
        state.posX = width - 1;
      } else {
        state.posY = 0;
        state.posX = 0;
      }
    } else {
      state.direction = 'backward';
      if (state.posX > 0) {
        state.posX--;
      } else if (state.posY < height - 1) {
        state.posY++;
        state.posX = 0;
      } else {
        state.posY = 0;
        state.posX = 0;
      }
    }

    const currentCell = mine.grid[state.posY][state.posX];
    currentCell.hasPlayer = true;
    currentCell.isRevealed = true;

    if (currentCell.hasCoin) {
      this.coinsMined++;
      mine.goldLeft--;
      currentCell.hasCoin = false;
    }

    state.fuel--;

    if (mine.goldLeft === 0) {
      this.resetEmployeeMine(index, mine.level + 1);
    }

    if (state.fuel <= 0) {
      this.stopEmployee(index);
    }
  }

  private resetEmployeeMine(index: number, mineLevel: number) {
    const state = this.employeeStates[index];
    if (!state) {
      return;
    }

    const newMine = this.createMine(mineLevel);
    newMine.grid[0][0] = {
      isMined: true,
      isRevealed: true,
      hasCoin: false,
      hasPlayer: true
    };

    this.mines[state.mineIndex] = newMine;
    state.posX = 0;
    state.posY = 0;
    state.direction = 'forward';
    state.mineLevel = mineLevel;
    state.fuel = this.employeeFuel[state.level - 1];
    state.speed = this.employeeSpeeds[state.level - 1];
    this.startEmployee(index);
  }

  createMine(level: number): Mine {
    let mine: Mine = { grid: [], level: level, goldLeft: 0 }
    let goldChance: number = (4 + level * 2) / 100;
    for (let i = 0; i < this.mineHeight; i++) {
      let row: Cell[] = [];
      for (let j = 0; j < this.mineWidth; j++) {
        row.push({
          isMined: false,
          isRevealed: false,
          hasCoin: Math.random() < goldChance,
          hasPlayer: false
        });
        if (row[j].hasCoin) {
          mine.goldLeft++;
        }
      }
      mine.grid.push(row);
    }
    return mine;
  }

  handleKeyPress(event: any) {
    event.preventDefault();
    if (event.key === 'ArrowRight' && this.checkPlayerBounds('right')) {
      this.playerX++;
      let currentCell: Cell = this.mines[0].grid[this.playerY][this.playerX];
      let prevCell: Cell = this.mines[0].grid[this.playerY][this.playerX - 1];

      currentCell.hasPlayer = true;
      prevCell.hasPlayer = false;
      prevCell.isMined = true;
      this.fuelLevel--;
    }
    else if (event.key === 'ArrowLeft' && this.checkPlayerBounds('left')) {
      this.playerX--;
      let prevCell: Cell = this.mines[0].grid[this.playerY][this.playerX + 1];
      let currentCell: Cell = this.mines[0].grid[this.playerY][this.playerX];

      currentCell.hasPlayer = true;
      prevCell.hasPlayer = false;
      prevCell.isMined = true;
      this.fuelLevel--;
    }
    else if (event.key === 'ArrowUp' && this.checkPlayerBounds('up')) {
      this.playerY--;

      let prevCell: Cell = this.mines[0].grid[this.playerY + 1][this.playerX];
      let currentCell: Cell = this.mines[0].grid[this.playerY][this.playerX];

      currentCell.hasPlayer = true;
      prevCell.hasPlayer = false;
      prevCell.isMined = true;
      this.fuelLevel--;
    }
    else if (event.key === 'ArrowDown' && this.checkPlayerBounds('down')) {
      this.playerY++;

      let prevCell: Cell = this.mines[0].grid[this.playerY - 1][this.playerX];
      let currentCell: Cell = this.mines[0].grid[this.playerY][this.playerX];

      currentCell.hasPlayer = true;
      prevCell.hasPlayer = false;
      prevCell.isMined = true;
      this.fuelLevel--;
    }
    if (this.mines[0].grid[this.playerY][this.playerX].hasCoin) {
      this.coinsMined++;
      this.mines[0].goldLeft--;
      this.mines[0].grid[this.playerY][this.playerX].hasCoin = false;
      this.fuelLevel++;
      if (this.mines[0].goldLeft === 0) {
        this.playerX = 0;
        this.playerY = 5;
        this.mines[0] = this.createMine(this.mines[0].level + 1);
      }
    }
    if (this.fuelLevel === 0) {
      this.fuelLevel = this.maxFuel;
      this.playerX = 0;
      this.playerY = 5;
      this.mines[0] = this.createMine(1);
      this.mines[0].grid[this.playerY][this.playerX] = {
        isMined: true,
        isRevealed: true,
        hasCoin: false,
        hasPlayer: true
      }
    }
    this.revealSurroundingCells();
  }

  revealSurroundingCells() {
    for (let i = 0; i < this.mines[0].grid.length; i++) {
      for (let j = 0; j < this.mines[0].grid[i].length; j++) {
        let temp: Cell = this.mines[0].grid[i][j];
        if (!temp.hasCoin) {
          temp.isRevealed = false;
        }
      }
    }
    let x: number = this.playerX;
    let y: number = this.playerY;
    let d: number = this.oreDetector;

    let i: number = x;

    // check in front
    while (i < this.mines[0].grid[y].length && i <= x + d + 1) {
      this.mines[0].grid[y][i].isRevealed = true;
      i++;
    }
    i = x;
    // behind
    while (i >= 0 && i >= x - d - 1) {
      this.mines[0].grid[y][i].isRevealed = true;
      i--;
    }
    i = y;
    // above
    while (i >= 0 && i >= y - d - 1) {
      this.mines[0].grid[i][x].isRevealed = true;
      i--;
    }
    i = y;
    // below
    while (i < this.mines[0].grid.length && i <= y + d + 1) {
      this.mines[0].grid[i][x].isRevealed = true;
      i++;
    }
    // if ore detector is upgraded, check for diags and spaces in between biags and straight lines
    if (d > 0) {
      for (let i = 1; i <= d; i++) {
        // diag down right
        if (x + i < this.mines[0].grid[0].length && y + i < this.mines[0].grid.length) {
          this.mines[0].grid[y + i][x + i].isRevealed = true;
        }
        // diag down left
        if (x - i >= 0 && y + i < this.mines[0].grid.length) {
          this.mines[0].grid[y + i][x - i].isRevealed = true;
        }
        // diag up right
        if (x + i < this.mines[0].grid[0].length && y - i >= 0) {
          this.mines[0].grid[y - i][x + i].isRevealed = true;
        }
        // diag up left
        if (x - i >= 0 && y - i >= 0) {
          this.mines[0].grid[y - i][x - i].isRevealed = true;
        }
        // spaces in between
        for (let j = 1; j < i; j++) {
          // down right
          if (x + j < this.mines[0].grid[0].length && y + i < this.mines[0].grid.length) {
            this.mines[0].grid[y + i][x + j].isRevealed = true;
          }
          if (x + i < this.mines[0].grid[0].length && y + j < this.mines[0].grid.length) {
            this.mines[0].grid[y + j][x + i].isRevealed = true;
          }
          // down left
          if (x - j >= 0 && y + i < this.mines[0].grid.length) {
            this.mines[0].grid[y + i][x - j].isRevealed = true;
          }
          if (x - i >= 0 && y + j < this.mines[0].grid.length) {
            this.mines[0].grid[y + j][x - i].isRevealed = true;
          }
          // up right
          if (x + j < this.mines[0].grid[0].length && y - i >= 0) {
            this.mines[0].grid[y - i][x + j].isRevealed = true;
          }
          if (x + i < this.mines[0].grid[0].length && y - j >= 0) {
            this.mines[0].grid[y - j][x + i].isRevealed = true;
          }
          // up left
          if (x - j >= 0 && y - i >= 0) {
            this.mines[0].grid[y - i][x - j].isRevealed = true;
          }
          if (x - i >= 0 && y - j >= 0) {
            this.mines[0].grid[y - j][x - i].isRevealed = true;
          }
        }
      }
    }
  }

  checkPlayerBounds(direction: string): boolean {
    if (direction === 'up') return this.playerY > 0;
    else if (direction === 'down') return this.playerY < this.mineHeight - 1;
    else if (direction === 'left') return this.playerX > 0;
    else if (direction === 'right') return this.playerX < this.mineWidth - 1;
    return false;
  }

  login(event: any) {
    this.appService.openApp('Login');
    this.appService.setAppTopLeft('Login', event.clientX, event.clientY);
  }

  upgradeOreDetector() {
    this.oreDetector++;
    this.revealSurroundingCells();
  }

  unlockEmployee(index: number) {
    this.employees[index] = 1;
    this.balance -= this.employeeCosts[0];
    this.userService.user.miningTools['employees'][index] = 1;
    this.initializeEmployee(index);
    this.updateUserBalance();
  }

  upgradeEmployee(index: number) {
    if (this.employees[index] === 0) {
      return;
    }
    let cost: number = this.employeeCosts[this.employees[index]];
    if (this.balance < cost) {
      return;
    }
    this.employees[index]++;
    this.userService.user.miningTools['employees'][index] = this.employees[index];
    this.balance -= cost;
    this.updateUserBalance();
  }

  onFocus() {
    this.focused = true;
    this.userMine.nativeElement.classList.add('focued');
    this.userMine.nativeElement.classList.remove('unfocused');
  }

  onBlur() {
    this.focused = false;
    this.userMine.nativeElement.classList.add('unfocused');
    this.userMine.nativeElement.classList.remove('focused');
  }

  updateUserBalance() {
    // pause all employees while updating balance
    this.employeeStates.forEach((state, index) => {
      if (state.intervalId !== undefined) {
        clearInterval(state.intervalId);
        state.intervalId = undefined;
      }
    });
    this.userService.user.balance = this.balance + this.coinsMined;
    this.userService.updateUserBackend().subscribe(() => {
      this.coinsMined = 0;
      // resume employee intervals
      this.employeeStates.forEach((state, index) => {
        if (state.level > 0) {
          this.startEmployee(index);
        }
      });
    });
  }
}
