import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Level1Component } from './level-1/level-1.component';
import { Level2Component } from './level-2/level-2.component';
import { Level3Component } from './level-3/level-3.component';
import { Level4Component } from './level-4/level-4.component';
import { Level5Component } from './level-5/level-5.component';
import { Level6Component } from './level-6/level-6.component';
import { Level7Component } from './level-7/level-7.component';
import { Level8Component } from './level-8/level-8.component';
import { Level9Component } from './level-9/level-9.component';
import { Level10Component } from './level-10/level-10.component';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-puzzle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './puzzle.component.html',
  styleUrl: './puzzle.component.css'
})
export class PuzzleComponent {
  level: number = 0;
  username: string = '';
  guess: string = '';
  guesses: string[] = [];
  showHistory = false;
  faq = false;
  wrong: boolean = false;
  guessResponse: string = '';

  levelMap: Record<number, any> = {
    1: Level1Component,
    2: Level2Component,
    3: Level3Component,
    4: Level4Component,
    5: Level5Component,
    6: Level6Component,
    7: Level7Component,
    8: Level8Component,
    9: Level9Component,
    10: Level10Component
  };

  levelTitles: Record<number, string> = {
    0: 'Solve My Puzzle!',
    1: 'Level 1',
    2: 'Royal Flush!',
    3: 'MIKE!',
    4: 'Babel, I would like a book please',
    5: 'Ave Caesar!',
    6: 'R G B',
    7: '0_o',
    8: 'Around the world!',
    9: 'Level 9!',
    10: '10!'
  }

  constructor(private apiService: ApiService, private appService: AppService) { }

  setLevel(level: number){
    if (level < 0 || level > 10) return;
    this.level = level;
    this.appService.setPuzzleTitle(this.levelTitles[level]);
  }

  loadProgress() {
    if (this.username.toLowerCase() === 'nate' || this.username.toLowerCase() === 'admin') {
      alert('nice try dumbass');
      return;
    }
    this.apiService.puzzleLoad(this.username).subscribe({
      next: (response) => {
        if (response.level === 0) alert('user not found');
        this.setLevel(response.level);
      },
      error: (error) => {
        alert('username not found');
      }
    });
  }

  saveProgress() {
    this.apiService.puzzleSave(this.username, this.level).subscribe({
      next: (response) => {
        alert(`saved ${this.username} at level ${this.level}`);
      },
      error: (error) => {
        alert('error saving progress');
      }
    });
  }

  guessAnswer() {
    this.apiService.puzzleGuess(this.guess, this.level).subscribe({
      next: (response) => {
        if (response.message === 'correct') {
          this.wrong = false;
          this.guess = '';
          this.guesses = [];
          this.setLevel(this.level+1);
        }
        else {
          this.guessResponse = response.message;
          this.wrong = true;
          this.guesses.push(this.guess);
          this.guess = '';
        }
      },
      error: (error) => {
        alert('server error, try again later');
        this.guesses.push(this.guess);
        this.guess = '';
      }
    });
  }
}
