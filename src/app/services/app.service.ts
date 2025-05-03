import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppService {
  private openApps = new BehaviorSubject<string[]>([]);
  private backgroundCode = new Subject<string>();
 
  openApps$ = this.openApps.asObservable();
  backgroundCode$ = this.backgroundCode.asObservable();

  openApp(code: string) {
    const current = this.openApps.value;
    if (!current.includes(code)) {
      this.openApps.next([...current, code]);
    }
  }

  minApp(code: string){
  }

  closeApp(code: string){
    const updated = this.openApps.value.filter(a => a !== code);
    this.openApps.next(updated);
  }

  updateBackground(background: string){
    this.backgroundCode.next(background);
  }
}
