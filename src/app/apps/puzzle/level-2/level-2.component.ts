import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-level-2',
  standalone: true,
  imports: [],
  templateUrl: './level-2.component.html',
  styleUrl: './level-2.component.css'
})
export class Level2Component {
  constructor(private appService: AppService){}
}
