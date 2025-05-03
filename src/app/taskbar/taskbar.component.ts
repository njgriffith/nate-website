import { Component } from '@angular/core';
import { AppService } from '../services/app.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-taskbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './taskbar.component.html',
  styleUrl: './taskbar.component.css'
})
export class TaskbarComponent {
  startMenuHidden: boolean = true;
  isAsleep: boolean = false;
  previousState: any;
  date: string = "";
  time: string = "";
  openApps: string[] = [];

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
    this.appService.openApps$.subscribe(apps => {
      this.openApps = apps;
    });
  }

  openApp(code: string) {
    this.appService.openApp(code);
  }

  toggleStartMenu() {
    this.startMenuHidden = !this.startMenuHidden;
  }

  sleep() {
    this.isAsleep = true;
    const body = document.body;
    this.previousState = body.innerHTML;
    body.innerHTML = "";
    body.style.background = "url('assets/icons/pipes.gif')";
    body.style.backgroundPosition = 'center';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundSize = 'cover';
  }

  updateDateTime() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();

    this.date = formattedDate;
    this.time = formattedTime
  }
}
