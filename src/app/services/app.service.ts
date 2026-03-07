import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { App } from '../models/app.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AppService {

  private mobileSubject = new BehaviorSubject<boolean>(false);
  mobile$ = this.mobileSubject.asObservable();

  constructor(private apiService: ApiService) { }
  private appList: App[] = this.createAppList(false);
  private apps = new BehaviorSubject<App[]>(this.appList);

  private createAppList(mobile: boolean): App[] {
    if (mobile){
      return [
      new App('Blog', false, false, 1, mobile),
      new App('Stuff I Like', false, false, 1, mobile),
      new App('Stats', false, false, 1, mobile),
      new App('Catalog', false, false, 1, mobile),
      new App('Settings', false, false, 1, mobile),
      new App('Weather', false, false, 1, mobile),
      new App('Settings', false, false, 1, mobile),
      new App('Mailing List', false, false, 1, mobile)
    ];
    }
    return [
      new App('Blog', false, false, 1, mobile),
      new App('Stuff I Like', true, false, 1, mobile),
      new App('Puzzle', false, false, 1, mobile),
      new App('Media Player',  false, false, 1, mobile),
      new App('Stats', false, false, 1, mobile),
      new App('Internet', false, false, 1, mobile),
      new App('Catalog', false, false, 1, mobile),
      new App('Settings', false, false, 1, mobile),
      new App('Mailing List', false, false, 1, mobile),
      new App('Weather', false, false, 1, mobile),
      new App('Minesweeper', false, false, 1, mobile),
      new App('Command Line', false, false, 1, mobile),
      new App('Recycle', false, false, 1, mobile),
    ];
  }

  setMobile(isMobile: boolean) {
    this.mobileSubject.next(isMobile);
    this.appList = this.createAppList(isMobile);
    this.apps.next(this.appList);
  }
  private backgroundCode = new Subject<string>();
  private puzzleTitle = new Subject<string>();

  apps$ = this.apps.asObservable();
  backgroundCode$ = this.backgroundCode.asObservable();
  puzzleTitle$ = this.puzzleTitle.asObservable();
  private sleepSubject = new BehaviorSubject<boolean>(false);
  sleep$ = this.sleepSubject.asObservable();
  private userSubject = new BehaviorSubject<string>('');
  user$ = this.userSubject.asObservable();
  private puzzleLevelSubject = new BehaviorSubject<number>(0);
  puzzleLevel$ = this.puzzleLevelSubject.asObservable();

  userStats: Record<string, any> = {
    'puzzleLevel': null,
    'easy': null,
    'medium': null,
    'hard': null,
    'expert': null,
    'master': null
  };

  setSleep(value: boolean) {
    this.sleepSubject.next(value);
  }

  login(username: string) {
    return this.apiService.userLogin(username).pipe(
      tap((response: any) => {
        this.setUser(username, response['user_data']);
      })
    );
  }

  setUser(username: string, userData: Record<string, any>) {
    this.userSubject.next(username);
    if (userData['puzzle'] !== null) {
      this.puzzleLevelSubject.next(userData['puzzle']);
    }

    this.userStats['puzzleLevel'] = userData['puzzle'];
    this.userStats['easy'] = userData['easy'];
    this.userStats['medium'] = userData['medium'];
    this.userStats['hard'] = userData['hard'];
    this.userStats['expert'] = userData['expert'];
    this.userStats['master'] = userData['master'];
  }

  setLevel(level: number) {
    this.puzzleLevelSubject.next(level);
  }

  openApp(code: string) {
    const updatedApps = this.apps.value.map(app =>
      app.name === code ? { ...app, isOpen: true } : app
    );
    this.apps.next(updatedApps);
    this.updateZIndex(code);
  }

  minApp(code: string) {
    const updatedApps = this.apps.value.map(app =>
      app.name === code ? { ...app, isMinimized: true } : app
    );
    this.apps.next(updatedApps);
  }

  maxApp(code: string) {
    this.updateZIndex(code);
    const currentApps = this.apps.value;
    const targetApp = currentApps.find(app => app.name === code);
    if (!targetApp || !targetApp.isMinimized) return;

    let updatedApps = currentApps.map(app =>
      app.name === code ? { ...app, isMinimized: false } : app
    );
    this.apps.next(updatedApps);
  }

  closeApp(code: string) {
    const updatedApps = this.apps.value.map(app =>
      app.name === code ? { ...app, isOpen: false } : app
    );
    this.apps.next(updatedApps);
  }

  updateBackground(background: string) {
    this.backgroundCode.next(background);
  }

  updateZIndex(code: string) {
    const currentApps = [...this.apps.value];
    const maxZ = Math.max(...currentApps.map(app => app.zIndex));

    const updatedApps = currentApps.map(app => {
      if (app.name === code) {
        if (app.name === 'Media Player') {
          return { ...app, zIndex: maxZ + 4 };
        }
        else {
          return { ...app, zIndex: maxZ + 1 }
        };
      }
      return app;
    });
    this.apps.next(updatedApps);
  }

  setPuzzleTitle(title: string) {
    this.puzzleTitle.next(title);
  }

  getAppNames(): string[]{
    let appNames: string[] = [];
    this.appList.forEach((app: App) => {
      appNames.push(app.name);
    });
    return appNames;
  }
}
