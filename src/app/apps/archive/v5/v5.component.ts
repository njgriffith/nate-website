import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-v5',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  templateUrl: './v5.component.html',
  styleUrl: './v5.component.css'
})
export class V5Component {
  startMenuHidden: boolean = true;
  isAsleep: boolean = false;
  previousState: any;
  date: string = "";
  time: string = "";
  changelog: string[] = [];

  @ViewChild('rightClickBox') rightClickBoxRef!: ElementRef;
  isDraggingBox: boolean = false;
  box: HTMLElement | undefined = undefined;
  rightClickStartX: number = 0;
  rightClickStartY: number = 0;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
    this.getCommits();
  }

  ngAfterViewInit() {
    this.box = this.rightClickBoxRef.nativeElement;
  }

  getCommits() {
    const url = `https://api.nate-griffith.com/commits`;
    try {
      this.http.get(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      }).subscribe((response: any) => {
        this.changelog = response.map((commit: any) => commit.commit.message);
      });
    } catch (error: any) {
      console.error('Error:', error.message);
    }
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

  boxDown(event: any) {
    if (event.button === 2) event.preventDefault();
    if (!this.box) return;
    this.box.style.display = 'block';
    this.isDraggingBox = true;
    this.box.style.left = `${event.clientX}px`;
    this.box.style.top = `${event.clientY}px`;

    this.rightClickStartX = event.clientX;
    this.rightClickStartY = event.clientY;
    this.box.style.left = `${event.clientX}px`;
    this.box.style.top = `${event.clientY}px`;
  }

  boxUp() {
    this.isDraggingBox = false;
    if (!this.box) return;
    this.box.style.width = '0px';
    this.box.style.height = '0px';
    this.box.style.display = 'none';
  }

  dragBox(event: any) {
    if (!this.isDraggingBox || !this.rightClickBoxRef.nativeElement || !this.box) return;
    console.log('drag')
    let currentX = event.clientX;
    let currentY = event.clientY;
    let width = Math.abs(event.clientX - this.rightClickStartX);
    let height = Math.abs(event.clientY - this.rightClickStartY);

    this.box.style.width = `${width}px`;
    this.box.style.height = `${height}px`;
    this.box.style.left = currentX < this.rightClickStartX ? `${currentX}px` : `${this.rightClickStartX}px`;
    this.box.style.top = currentY < this.rightClickStartY ? `${currentY}px` : `${this.rightClickStartY}px`;
  }
}
