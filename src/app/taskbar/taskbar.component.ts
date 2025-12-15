import { Component } from '@angular/core';
import { AppService } from '../services/app.service';
import { CommonModule } from '@angular/common';
import { App } from '../models/app.model';

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
  apps: App[] = [];
  taskbarApps: App[] = [];

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
    this.appService.apps$.subscribe(apps => {
      this.apps = apps;
      this.taskbarApps = this.apps.filter(app => app.isOpen || app.isMinimized);
    });
  }

  openApp(code: string) {
    this.appService.openApp(code);
  }
  maxApp(code: string) {
    this.appService.maxApp(code);
  }

  toggleStartMenu() {
    this.startMenuHidden = !this.startMenuHidden;
  }

  sleep() {
    this.appService.setSleep(true);
  }

  updateDateTime() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();

    this.date = formattedDate;
    this.time = formattedTime
  }
}
