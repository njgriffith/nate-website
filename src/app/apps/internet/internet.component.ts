import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotAVirusComponent } from "./not-a-virus/not-a-virus.component";
import { GodLivesComponent } from './god-lives/god-lives.component';
import { WillComponent } from './will/will.component';
import { NateComponent } from './nate/nate.component';

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
    'http://www.god-lives.com': GodLivesComponent,
    'http://www.not-a-virus.com': NotAVirusComponent,
    'http://www.will.computer': WillComponent,
    'http://www.nate-griffith.com': NateComponent
  }
  urls: string[] = Object.keys(this.websites);
}
