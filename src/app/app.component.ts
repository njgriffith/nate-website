import { Component } from '@angular/core';
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
  mobile = false;
  constructor(private breakpointObserver: BreakpointObserver) {}

ngOnInit() {
  this.breakpointObserver.observe([Breakpoints.Handset])
    .subscribe(result => {
      if (result.matches) {
        this.mobile = true;
      }
      else{
        this.mobile = false;
      }
    });
}
}
