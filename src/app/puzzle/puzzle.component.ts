import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-puzzle',
  standalone: true,
  imports: [],
  templateUrl: './puzzle.component.html',
  styleUrl: './puzzle.component.css'
})
export class PuzzleComponent {
  currentLevel: number = 1;
  @Output() levelEmit = new EventEmitter<number>();

  sendNumber() {
    this.levelEmit.emit(this.currentLevel);
  }
}
