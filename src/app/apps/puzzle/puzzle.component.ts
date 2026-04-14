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
import { Level11Component } from './level-11/level-11.component';
import { User, UserService } from '../../services/user.service';
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
  password: string = '';
  isLoggedIn: boolean = false;
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
    10: Level10Component,
    11: Level11Component
  };

  levelTitles: Record<number, string> = {};

  constructor(private apiService: ApiService, private userService: UserService, private appService: AppService) { }

  ngOnInit() {
    this.userService.user$.subscribe((user: User) => {
      this.username = user.username !== 'guest' ? user.username : '';
      this.password = user.password;
      this.level = user.puzzleLevel;
      this.isLoggedIn = user.isLoggedIn;
    });
    this.levelTitles = this.appService.levelTitles;
  }

  setLevel(level: number) {
    if (level < 0 || level > 11) return;
    this.level = level;
    this.userService.user.puzzleLevel = level;
    this.userService.refreshUser();
  }

  loadProgress() {
    this.userService.login(this.username, this.password).subscribe({
      next: (user: any) => {
        this.setLevel(user['user_data']['puzzle_level']);
        this.isLoggedIn = true;
      },
      error: () => {
        alert('Unknown username password combination');
        this.isLoggedIn = false;
      }
    });
  }

  saveProgress(event: any) {
    if (!this.isLoggedIn) {
      this.appService.setAppTopLeft('Login', event.clientX, event.clientY);
      this.appService.openApp('Login');
      return;
    }
    this.userService.user.puzzleLevel = this.level;
    this.userService.updateUserBackend();
  }

  guessAnswer() {
    this.apiService.puzzleGuess(this.guess, this.level).subscribe({
      next: (response) => {
        if (response.message === 'correct') {
          this.wrong = false;
          this.guess = '';
          this.guesses = [];
          this.setLevel(this.level + 1);
          if (this.userService.user.isLoggedIn) {
            this.userService.user.puzzleLevel = this.level;
            this.userService.updateUserBackend();
          }
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
