import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotAVirusComponent } from "./not-a-virus/not-a-virus.component";
import { GodLivesComponent } from './god-lives/god-lives.component';
import { V5Component } from '../archive/v5/v5.component';

@Component({
  selector: 'app-internet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './internet.component.html',
  styleUrl: './internet.component.css'
})
export class InternetComponent {
  selectedWebsite: string | undefined = undefined;
  // selectedWebsite: string | undefined = 'http://www.god-lives.com';

  websites: Record<string, any> = {
    'http://www.nate-griffith.com': V5Component,
    'http://www.not-a-virus.com': NotAVirusComponent,
    'http://www.god-lives.com': GodLivesComponent
  }
  urls: string[] = Object.keys(this.websites);
}
