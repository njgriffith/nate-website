import { Component } from '@angular/core';
import { User, UserService } from '../../services/user.service';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  isAdmin: boolean = false;
  types: string[] = ['Album', 'Movie'];
  selectedType: string = this.types[0];
  tools: string[] = ['Tier Inserter', 'Update Passwords'];
  selectedTool: string = this.tools[0];
  title: string = '';
  artist: string = '';
  tiers: string[] = ["the_best_plus", "the_best", "the_best_minus", "amazing_plus", "amazing", "amazing_minus", "great_plus", "great", "great_minus"];
  selectedTier: string = '';

  backendSuccess: boolean = false;
  backendMessage: string = '';

  users: User[] = [];
  selectedUser: User | undefined = undefined;

  constructor(private userService: UserService, private apiService: ApiService){}

  ngOnInit(){
    this.userService.user$.subscribe((user: User) => {
      this.isAdmin = user.isLoggedIn === true && user.username === 'nate';
    });
  }

  postEntryToBackend(){
    console.log(this.title === '');
    console.log(this.selectedType === 'Album' && this.artist === '');
    if (this.title === '' || (this.selectedType === 'Album' && this.artist === '')){
      return;
    }
    const body: Record<string, string> = {
      type: this.selectedType,
      tier: this.selectedTier,
      title: this.title,
      artist: this.artist
    };

    this.apiService.postToTier(body).subscribe((response: any) => {
      console.log(response);
    });
  }


}
