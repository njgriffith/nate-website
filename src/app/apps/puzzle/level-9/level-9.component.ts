import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-level-9',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './level-9.component.html',
  styleUrl: './level-9.component.css'
})
export class Level9Component {
  n: number = 27;
  grid: any[] = [];
  ngOnInit() {
    for (let i = 0; i < this.n; i++) {
      let temp: boolean[] = [];
      for(let j=0;j<this.n;j++){
        temp.push(true);
      }
      this.grid.push(temp);
    }
  }

  flip(i: number, j: number){
    this.grid[i][j] = !this.grid[i][j];
  }
}
