import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-strawberry-jam',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './strawberry-jam.component.html',
  styleUrl: './strawberry-jam.component.css'
})
export class StrawberryJamComponent {
  @Input() data: any;
  subDifficulties: any = {
    'beginner': ['Green', 'Yellow', 'Red', 'Heartside'],
    'intermediate': ['Green', 'Yellow', 'Red', 'Heartside'],
    'advanced': ['Green', 'Yellow', 'Red', 'Heartside'],
    'expert': ['Green', 'Yellow', 'Red', 'Heartside'],
    'grandmaster': ['Green', 'Yellow', 'Red', 'Cracked', 'Heartside']
  };


  calculatePercentage(part: number, whole: number){
    return `${(part/whole) * 100}%`;
  }

}
