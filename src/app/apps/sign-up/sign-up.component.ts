import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  email: string = '';
  success: boolean | null = null;

  constructor (private apiService: ApiService){}

  signUp() {
    if (confirm("Sign up using this email?\n" + this.email)) {
      this.apiService.signUp(this.email).subscribe({
        next: (response) => {
          this.success = true;
          console.log('Signed up successfully:', response);
        },
        error: (error) => {
          this.success = false;
          console.error(error);
        }
      });
    }
  }
}
