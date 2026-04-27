import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotAVirusComponent } from "./not-a-virus/not-a-virus.component";
import { GodLivesComponent } from './god-lives/god-lives.component';
import { WillComponent } from './will/will.component';

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

  websites: Record<string, { siteComponent: any, iframe: boolean }> = {
    'https://www.god-lives.com': {
      siteComponent: GodLivesComponent,
      iframe: false
    },
    'http://www.not-a-virus.com': {
      siteComponent: NotAVirusComponent,
      iframe: false
    },
    'https://nate-griffith.com': {
      siteComponent: WillComponent,
      iframe: true
    },
    'https://will.computer': {
      siteComponent: WillComponent,
      iframe: true
    },
    'https://ethanshealey.com': {
      siteComponent: WillComponent,
      iframe: true
    }
  }
  urls: string[] = Object.keys(this.websites);
}
