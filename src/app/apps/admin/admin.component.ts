import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppService } from '../../services/app.service';
import { User, UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  constructor(private userService: UserService, private appService: AppService) { }

  ngOnInit() {
    this.appNames = this.appService.getAppNames();
    let nameString: string = '';
    this.appNames.forEach((appName: string, index: number) => {
      this.commandMap[appName] = {
        response: `opening ${appName}...`,
        next: undefined
      }
      this.commandMap['close ' + appName] = {
        response: `closing ${appName}...`,
        next: undefined
      }
      index === this.appNames.length - 1 ? nameString += appName : nameString += appName + '\n'
    });
    this.commandMap['list-apps'] = {
      response: nameString,
      next: undefined
    }

    this.userService.user$.subscribe((user: User) => {
      this.user = user.username || 'guest';
      this.isLoggedIn = user.isLoggedIn;
      this.userStats = { ...user };
    });
  }

  commandHistory: string[] = [];
  commandHistoryDisplay: { text: string; isPromptInput: boolean }[] = [];
  commandIndex = 0;
  appNames: string[] = [];
  user: string = '';
  isLoggedIn: boolean = false;
  userStats: Record<string, any> = {};

  // Prompt chain state
  promptChain: {
    originCommand: string;
    inputs: string[];
    currentPrompt: string;
    nextKey: string | undefined;
  } | null = null;

  get isPromptingUser(): boolean {
    return this.promptChain !== null;
  }

  get currentPrompt(): string {
    return this.promptChain?.currentPrompt ?? '';
  }

  commandMap: Record<string, any> = {
    'sleep': {
      response: 'suspending...',
      next: undefined
    },
    'clear': {
      response: '',
      next: undefined
    },
    'login': {
      response: 'enter username: ',
      next: 'password'
    },
    'password': {
      response: 'enter password: ',
      next: undefined
    },
    'signup': {
      response: 'enter new username: ',
      next: 'new-password'
    },
    'new-password': {
      response: 'enter new password: ',
      next: undefined
    },
    'me': {
      response: 'not logged in',
      next: undefined
    },
    'help': {
      response: 'login - log user in\n' +
        'signup - create account\n' +
        'me - list current user\'s stats\n' +
        'list-apps - list application names\n' +
        '<app-name> - start application\n' +
        'close <app-name> - close application\n' +
        'clear - clear CLI\n' +
        'sleep - sleeps computer',
      next: undefined
    }
  };

  @ViewChild('cursor', { static: true }) cursor!: ElementRef<HTMLSpanElement>;
  @ViewChild('blink', { static: true }) blink!: ElementRef<HTMLSpanElement>;
  @ViewChild('cli', { static: true }) cli!: ElementRef<HTMLDivElement>;
  focused: boolean = false;

  processCommand(input: string) {
    const el = this.cli?.nativeElement;
    const prevHeight = el ? el.scrollHeight : 0;

    if (this.promptChain) {
      // mid-chain: collect input and advance
      this.commandHistoryDisplay.push({ text: input, isPromptInput: true });
      this.promptChain.inputs.push(input);

      const nextKey = this.promptChain.nextKey;

      if (nextKey && this.commandMap[nextKey]) {
        // More steps remain
        this.promptChain.currentPrompt = this.commandMap[nextKey].response;
        this.promptChain.nextKey = this.commandMap[nextKey].next;
      }
      else {
        // Chain complete
        const originCommand = this.promptChain.originCommand;
        const inputs = [...this.promptChain.inputs];
        this.promptChain = null;
        this.handlePromptEnd(originCommand, inputs);
      }

      setTimeout(() => this.scrollToBottom(prevHeight), 0);
      return;
    }

    // Normal command
    if (input === 'clear') {
      this.commandHistoryDisplay = [];
    }
    else if (input === 'me') {
      console.log('user stats', this.userStats)
      this.commandMap['me'] = {
        response: `user stats: ${this.user}\n` +
          `puzzle level: ${this.userStats['puzzleLevel']}\n` +
          `balance: ${this.userStats['balance']}\n` +
          `shapes owned: ${this.userStats['shapesOwned'] || 'none'}\n` +
          `mining tools: ${this.userStats['miningTools'] || 'none'}\n` +
          `minesweeper best times:\n` +
          `\teasy: ${this.userStats['easy'] ?? 'N/A'}\n` +
          `\tmedium: ${this.userStats['medium'] ?? 'N/A'}\n` +
          `\thard: ${this.userStats['hard'] ?? 'N/A'}\n` +
          `\texpert: ${this.userStats['expert'] ?? 'N/A'}\n` +
          `\tmaster: ${this.userStats['master'] ?? 'N/A'}\n`,
        next: undefined
      }
      this.commandHistoryDisplay.push({ text: 'me', isPromptInput: false });
    }
    else if (!this.commandMap[input] || !this.commandMap[input].next) {
      this.commandHistoryDisplay.push({ text: input, isPromptInput: false });
    }

    if (!this.commandMap[input]) {
      this.commandHistory.push(input);
      setTimeout(() => this.scrollToBottom(prevHeight), 0);
      return;
    }

    const entry = this.commandMap[input];

    if (entry.next) {
      // Start a prompt chain
      this.promptChain = {
        originCommand: input,
        inputs: [],
        currentPrompt: entry.response,
        nextKey: entry.next
      };
    } else {
      // Plain command — run its side effects
      this.commandHistory.push(input);

      if (input === 'sleep') {
        this.appService.setSleep(true);
      }
      if (this.appNames.includes(input)) {
        this.appService.openApp(input);
      }
      if (input.startsWith('close ')) {
        const appName = input.slice(6).trim();
        this.appService.closeApp(appName);
      }
    }

    setTimeout(() => this.scrollToBottom(prevHeight), 0);
  }

  handlePromptEnd(originCommand: string, inputs: string[]) {
    this.commandHistory.push(originCommand)
    if (originCommand === 'login') {
      const [username, password] = inputs;
      this.userService.login(username, password).subscribe({
        next: (response: any) => {
          this.user = username;
          let data: Record<string, any> = response?.user_data;
          if (!data) return;
          this.commandMap['success'] = {
            response: `login success! - welcome ${username}\n` +
              `puzzle level: ${data['puzzle_level']}\n` +
              `balance: ${data['balance']}\n` +
              `shapes owned: ${data['shapes_owned'] || 'none'}\n` +
              `mining tools: ${data['mining_tools'] || 'none'}\n` +
              `minesweeper best times:\n` +
              `\teasy: ${data['ms_easy_best'] ?? 'N/A'}\n` +
              `\tmedium: ${data['ms_medium_best'] ?? 'N/A'}\n` +
              `\thard: ${data['ms_hard_best'] ?? 'N/A'}\n` +
              `\texpert: ${data['ms_expert_best'] ?? 'N/A'}\n` +
              `\tmaster: ${data['ms_master_best'] ?? 'N/A'}\n`,
            next: undefined
          }
          this.commandHistoryDisplay.push({ text: 'success', isPromptInput: false });
          setTimeout(() => this.scrollToBottom(), 0);
        },
        error: (response: any) => {
          this.commandMap['failure'] = {
            response: `login failed :(\ncreate an account with the "signup" command`,
            next: undefined
          }
          this.commandHistoryDisplay.push({ text: 'failure', isPromptInput: false });
          setTimeout(() => this.scrollToBottom(), 0);
        }
      });
    }
    else if (originCommand === 'signup') {
      const [username, password] = inputs;
      this.userService.createUser(username, password).subscribe({
        next: (response: any) => {
          this.commandHistoryDisplay.push({ text: 'success', isPromptInput: false });
          setTimeout(() => this.scrollToBottom(), 0);
        },
        error: (response: any) => {
          this.commandMap['failure'] = {
            response: `signup failed :(\n${response.error.error}`,
            next: undefined
          }
          this.commandHistoryDisplay.push({ text: 'failure', isPromptInput: false });
          setTimeout(() => this.scrollToBottom(), 0);
        }
      });
    }
    // Add future prompt-chain handlers here:
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
      }
      cur.textContent = '';
      this.commandIndex = this.commandHistory.length;
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.commandIndex > 0) this.commandIndex--;
      cur.textContent = this.commandHistory[this.commandIndex] ?? '';
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.commandIndex < this.commandHistory.length - 1) {
        this.commandIndex++;
        cur.textContent = this.commandHistory[this.commandIndex];
      } else {
        cur.textContent = '';
      }
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      const currentText = (cur.textContent || '').trim();
      const matches = Object.keys(this.commandMap).filter(cmd => cmd.startsWith(currentText));
      if (matches.length === 1) {
        cur.textContent = matches[0];
      }
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
        if (el.scrollHeight > prevHeight) el.scrollTop = el.scrollHeight;
      } else {
        el.scrollTop = el.scrollHeight;
      }
    } catch (e) { }
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
