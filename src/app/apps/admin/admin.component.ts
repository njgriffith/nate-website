import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppService } from '../../services/app.service';
import { sample } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  constructor(private apiService: ApiService, private appService: AppService) { }

  ngOnInit() {
    this.appNames = this.appService.getAppNames();
    let nameString: string = '';
    this.appNames.forEach((appName: string, index: number) => {
      this.availableCommands[appName] = `opening ${appName}...`;
      this.availableCommands['close ' + appName] = `closing ${appName}...`;
      index === this.appNames.length - 1 ? nameString += appName : nameString += appName + '\n'
    });
    this.availableCommands['list-apps'] = nameString;

    this.appService.user$.subscribe(username => {
      this.user = username;
    });
  }

  user: string = 'guest';
  password: string = '';
  waiting: boolean = false;
  userStats: Record<string, any> = {};
  loggedIn: boolean | null = null;
  commandHistory: string[] = [];
  commandIndex = 0;
  availableCommands: Record<string, string> = {
    'sleep': 'suspending...',
    'clear': ' ',
    'login': ' ',

    'help': 'login - log user in\n' +
      'list-apps - list application names\n' +
      '<app-name> - start application\n' +
      'close <app-name> - close application\n' +
      'clear - clear CLI\n' +
      'sleep - sleeps computer'
  };
  appNames: string[] = [];
  @ViewChild('cursor', { static: true }) cursor!: ElementRef<HTMLSpanElement>;
  @ViewChild('blink', { static: true }) blink!: ElementRef<HTMLSpanElement>;
  @ViewChild('cli', { static: true }) cli!: ElementRef<HTMLDivElement>;
  focused: boolean = false;

  processCommand(command: string) {
    const el = this.cli?.nativeElement;
    const prevHeight = el ? el.scrollHeight : 0;

    if (command === 'clear') {
      this.commandHistory = [];
      setTimeout(() => this.scrollToBottom(), 0);
      return;
    }

    else if (command === 'sleep') {
      this.commandHistory.push(command);
      this.appService.setSleep(true);
    }

    else if (command.includes('Enter username to login: ')) {
      const username = command.replace('Enter username to login: ', '').trim();
      // push the command so it shows immediately, then await the login response
      this.commandHistory.push(command);
      this.waiting = true;
      // call login and wait for response
      this.appService.login(username).subscribe({
        next: (resp) => {
          this.userStats = this.appService.userStats;
          this.waiting = false;
          setTimeout(() => this.scrollToBottom(prevHeight), 0);
        },
        error: () => {
          // on error, clear waiting and still scroll
          this.waiting = false;
          setTimeout(() => this.scrollToBottom(prevHeight), 0);
        }
      });
      return;
    }

    else if (this.appNames.includes(command)) {
      this.appService.openApp(command);
    }

    else if (command.length >= 6 && command.substring(0, 6) === 'close ') {
      let splitCommand: string[] = command.split(' ');
      let appName: string = '';
      for (let i = 1; i < splitCommand.length; i++) {
        appName += splitCommand[i] + ' ';
      }
      this.appService.closeApp(appName.trim());
    }
    this.commandHistory.push(command);
    // wait for DOM update before checking scrollHeight
    setTimeout(() => this.scrollToBottom(prevHeight), 0);
  }

  recordInput(event: KeyboardEvent) {
    if (!this.focused) return;
    const cur = this.cursor.nativeElement;

    if (event.key === 'Backspace') {
      event.preventDefault();
      cur.textContent = (cur.textContent || '').slice(0, -1);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const text = (cur.textContent || '').trim();
      if (text.length) {
        this.processCommand(text);
        if (text === 'login') {
          cur.textContent = 'Enter username to login: ';
          this.commandIndex = this.commandHistory.length;
          return;
        }
      }
      cur.textContent = '';
      this.commandIndex = this.commandHistory.length;
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.commandIndex > 0) {
        this.commandIndex--;
      }
      cur.textContent = this.commandHistory[this.commandIndex];
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.commandIndex < this.commandHistory.length - 1) {
        this.commandIndex++;
      }
      else {
        cur.textContent = '';
        return;
      }
      cur.textContent = this.commandHistory[this.commandIndex];
      return;
    }

    if (event.key.length === 1) {
      event.preventDefault();
      cur.textContent = (cur.textContent || '') + event.key;
    }
  }

  private scrollToBottom(prevHeight?: number): void {
    try {
      const el = this.cli?.nativeElement;
      if (!el) return;
      if (typeof prevHeight === 'number') {
        if (el.scrollHeight > prevHeight) {
          el.scrollTop = el.scrollHeight;
        }
      } else {
        el.scrollTop = el.scrollHeight;
      }
    } catch (e) {
      // ignore
    }
  }

  onFocus() {
    this.focused = true;
    this.blink.nativeElement.classList.add('blink');
    this.blink.nativeElement.classList.remove('hidden');
  }

  onBlur() {
    this.focused = false;
    this.blink.nativeElement.classList.remove('blink');
    this.blink.nativeElement.classList.add('hidden');
  }
}
