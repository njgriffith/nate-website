import { Component } from '@angular/core';

@Component({
  selector: 'app-not-a-virus',
  standalone: true,
  imports: [],
  templateUrl: './not-a-virus.component.html',
  styleUrl: './not-a-virus.component.css'
})
export class NotAVirusComponent {
  downloadVirus(){
    document.body.style.backgroundImage = "url('/resources/media/virus.gif')";
  }
}
