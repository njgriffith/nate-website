import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-v4',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './v4.component.html',
  styleUrl: './v4.component.css'
})
export class V4Component {
  startMenuHidden: boolean = true;
  isAsleep: boolean = false;
  previousState: any;
  date: string = "";
  time: string = "";

  constructor(){ }

  ngOnInit() {
    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  toggleStartMenu() {
    this.startMenuHidden = !this.startMenuHidden;
  }

  updateDateTime() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();

    this.date = formattedDate;
    this.time = formattedTime
  }
}
