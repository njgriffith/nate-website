import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { PoleVaultComponent } from "./pole-vault/pole-vault.component";
import { FormsModule } from '@angular/forms';
import { StrawberryJamComponent } from "./strawberry-jam/strawberry-jam.component";
import { PantheonsComponent } from "./pantheons/pantheons.component";
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, PoleVaultComponent, FormsModule, StrawberryJamComponent, PantheonsComponent],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent {
  statsData: any = {};
  selectedDisplay: string = '';

  constructor (private apiService: ApiService){}

  ngOnInit(){
    this.apiService.getStats().subscribe((response) => {
      this.statsData = response['data'];
      this.selectedDisplay = 'pole vault';
    });
  }
}
