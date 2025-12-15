import { Component } from '@angular/core';
import { AppService } from './services/app.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TaskbarComponent } from "./taskbar/taskbar.component";
import { DesktopComponent } from "./desktop/desktop.component";
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskbarComponent, DesktopComponent, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  mobile: boolean = false;
  sleep: boolean = false;
  user: string = 'guest';
  constructor(private breakpointObserver: BreakpointObserver, private appService: AppService) { }

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        if (result.matches) {
          this.mobile = true;
        }
        else {
          this.mobile = false;
        }
      });

    this.appService.sleep$.subscribe(flag => {
      this.sleep = flag;
    });

    this.appService.user$.subscribe(username => {
      this.user = username;
    });
  }

  wakeUp() {
    this.sleep = false;
  }
}
