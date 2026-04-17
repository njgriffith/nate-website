import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login-popup',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.css'
})
export class LoginPopupComponent {
  username: string = '';
  password: string = '';
  resultMessage: string = '';
  isLoggedIn: boolean = false;

  constructor(private userService: UserService) { }

  login() {
    this.userService.login(this.username, this.password).subscribe((response: any) => {
      this.resultMessage = 'Login successful!';
      this.isLoggedIn = true;
    }, (error: any) => {
      this.resultMessage = 'Login failed: ' + error.error.error;
    });
  }
  createUser() {
    this.userService.createUser(this.username, this.password).subscribe((response: any) => {
      this.resultMessage = 'User created successfully! Please log in.';
    }, (error: any) => {
      this.resultMessage = 'User creation failed: ' + error.error.error;
    });
  }
}
