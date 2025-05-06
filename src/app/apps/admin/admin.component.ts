import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  password: string = '';
  success = false;

  constructor(private apiService: ApiService) { }

  login() {
    this.apiService.adminLogin(this.password).subscribe({
      next: () => {
        this.success = true;
      },
      error: () => {
        this.success = false;
      }
    });
  }
}
