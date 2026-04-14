import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { App } from '../models/app.model';

@Injectable({ providedIn: 'root' })
export class AppService {

  private mobileSubject = new BehaviorSubject<boolean>(false);
  mobile$ = this.mobileSubject.asObservable();

  constructor() { }
  private appList: App[] = [
    new App('Archive', false, false, 1),
    new App('Shape Store', true, false, 1),
    new App('Mine Nate Coin', false, false, 1),
    new App('Stuff I Like', false, false, 1),
    new App('Puzzle', false, false, 1),
    new App('Media Player', true, false, 1),
    new App('Stats', false, false, 1),
    new App('Internet', false, false, 1),
    new App('Catalog', false, false, 1),
    new App('Settings', false, false, 1),
    new App('Weather', false, false, 1),
    new App('Minesweeper', false, false, 1),
    new App('Command Line', false, false, 1),
    new App('Login', true, false, 1),
    new App('Recycle', false, false, 1)
  ];

  levelTitles: Record<number, string> = {
    0: 'Solve My Puzzle!',
    1: 'Level 1',
    2: 'Royal Flush! (Level 2)',
    3: 'Curie! (Level 3)',
    4: 'Babel, I would like a book please (Level 4)',
    5: 'Ave Caesar! (Level 5)',
    6: 'R G B (Level 6)',
    7: 'Breckenridge! (Level 7)',
    8: 'Around the world! (Level 8)',
    9: 'What\'s in the box!! (Level 9)',
    10: 'Ten! (Level 10)',
    11: 'Congrats!'
  };

  private apps = new BehaviorSubject<App[]>(this.appList);
  setMobile(isMobile: boolean) {
    this.mobileSubject.next(isMobile);
    this.apps.next(this.appList);
  }
  private backgroundCode = new Subject<string>();
  private puzzleTitle = new Subject<string>();

  apps$ = this.apps.asObservable();
  backgroundCode$ = this.backgroundCode.asObservable();
  puzzleTitle$ = this.puzzleTitle.asObservable();
  private sleepSubject = new BehaviorSubject<boolean>(false);
  sleep$ = this.sleepSubject.asObservable();
  recycledAppsSubject = new BehaviorSubject<any[]>([]);
  recycledApps$ = this.recycledAppsSubject.asObservable();

  setSleep(value: boolean) {
    this.sleepSubject.next(value);
  }

  openApp(code: string) {
    const updatedApps = this.apps.value.map(app =>
      app.name === code ? { ...app, isOpen: true } : app
    );
    this.apps.next(updatedApps);
    this.updateZIndex(code);
  }

  toggleApp(code: string) {
    const currentApps = this.apps.value;
    const targetApp = currentApps.find(app => app.name === code);
    if (!targetApp) return;
    if (targetApp.isMinimized) {
      this.maxApp(code);
    }
    else {
      this.minApp(code);
    }
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

  getAppNames(): string[] {
    let appNames: string[] = [];
    this.appList.forEach((app: App) => {
      appNames.push(app.name);
    });
    return appNames;
  }

  recycleApps(appNames: string[]) {
    const currentRecycled = this.recycledAppsSubject.value;
    appNames.forEach((app: string) => {
      currentRecycled.push({
        name: app,
        timestamp: new Date().toISOString()
      });
    });
    this.recycledAppsSubject.next(currentRecycled);
  }

  restoreApp(appName: string) {
    let currentRecycled: any[] = this.recycledAppsSubject.value;
    currentRecycled = currentRecycled.filter(app => app.name !== appName);
    this.recycledAppsSubject.next(currentRecycled);
  }
}
