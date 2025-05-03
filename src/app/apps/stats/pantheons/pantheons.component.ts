import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pantheons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pantheons.component.html',
  styleUrl: './pantheons.component.css'
})
export class PantheonsComponent {
  @Input() data: any;
  keys: string[] = ['p1', 'p2', 'p3', 'p4', 'p5'];
  bindings: string[] = ['Nail', 'Mask', 'Soul', 'Charm', 'All'];
}
