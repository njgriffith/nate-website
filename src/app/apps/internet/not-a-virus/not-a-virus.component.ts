import { Component } from '@angular/core';
import { AppService } from '../../../services/app.service';

@Component({
  selector: 'app-not-a-virus',
  standalone: true,
  imports: [],
  templateUrl: './not-a-virus.component.html',
  styleUrl: './not-a-virus.component.css'
})
export class NotAVirusComponent {
  constructor(private appService: AppService) { }
  downloadVirus(){
    this.appService.updateBackground('virus');
  }
  ngOnDestroy() {
    this.appService.updateBackground('metropolis');
  }
}
