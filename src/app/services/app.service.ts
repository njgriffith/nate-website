import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { App } from '../models/app.model';

@Injectable({ providedIn: 'root' })
export class AppService {
  private appList: App[] = [
    new App('Blog', false, false, 1),
    new App('Album Reviews', false, false, 1),
    new App('Lists', false, false, 1),
    new App('Solve My Puzzle', false, false, 1),
    new App('Media Player', true, false, 1),
    new App('Stats', false, false, 1),
    new App('Internet', false, false, 1),
    new App('Catalog', false, false, 1),
    new App('Settings', false, false, 1),
    new App('Mailing List', false, false, 1),
    new App('Weather', false, false, 1),
    new App('Minesweeper', false, false, 1),
    new App('Admin', false, false, 1),
    new App('Recycle', false, false, 1)
  ];
  private apps = new BehaviorSubject<App[]>(this.appList);
  private backgroundCode = new Subject<string>();
  private puzzleTitle = new Subject<string>();

  apps$ = this.apps.asObservable();
  backgroundCode$ = this.backgroundCode.asObservable();
  puzzleTitle$ = this.puzzleTitle.asObservable();

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
        return { ...app, zIndex: maxZ + 1 };
      }
      return app;
    });
    this.apps.next(updatedApps);
  }

  setPuzzleTitle(title: string) {
    this.puzzleTitle.next(title);
  }
}
