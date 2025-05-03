import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  backgrounds: string[] = ['cave', 'end_jungle', 'floating_island', 'metropolis', 'mushroom_kingdom', 'rainbow_road'];

  constructor(private appService: AppService){}

  updateBackground(background: string){
    this.appService.updateBackground(background);
  }
}
