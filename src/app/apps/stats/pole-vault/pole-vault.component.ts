import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pole-vault',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pole-vault.component.html',
  styleUrl: './pole-vault.component.css'
})
export class PoleVaultComponent {
  @Input() data: any;

  displayJump(jump: number) {
    return `${Math.floor(jump / 12)}' ${jump % 12}"`;
  }

  calculateJumpPercentage(jump: number) {
    return `${(jump / this.data.long_term_goal) * 100}%`;
  }
}
