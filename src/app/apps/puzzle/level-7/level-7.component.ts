import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-level-7',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './level-7.component.html',
  styleUrl: './level-7.component.css'
})
export class Level7Component {
  sizes: number[] = [119, 119, 115, 115, 97, 100, 97, 100, 98, 97];
}
