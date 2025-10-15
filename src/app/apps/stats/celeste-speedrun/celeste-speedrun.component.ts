import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-celeste-speedrun',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './celeste-speedrun.component.html',
  styleUrl: './celeste-speedrun.component.css'
})
export class CelesteSpeedrunComponent {
  @Input() data: any;
  graphData: number[] = [];
  timeData: string[] = [];
  placementData: number[] = [];
  containerHeight: number = 0;

  ngOnChanges() {
    if (!this.data) return;
    this.data.forEach((item: any) => {
      let strings: string[] = item['time'].split(':');
      this.placementData.push(item['rank']);
      this.timeData.push(item['time']);
      if (strings.length === 3) {
        this.graphData.push((parseInt(strings[0]) * 3600) + (parseInt(strings[1]) * 60) + parseInt(strings[2]));
      }
      else {
        this.graphData.push((parseInt(strings[0]) * 60) + parseInt(strings[1]));
      }
    });
    this.containerHeight = ((this.graphData[0] - this.graphData[this.graphData.length-1])/10) + 20;
  }

  getYOffset(index: number) {
    return 0 + ((this.graphData[0] - this.graphData[index]) / 10);
  }
}
