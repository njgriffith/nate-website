import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotAVirusComponent } from "./not-a-virus/not-a-virus.component";
import { EbayComponent } from "./ebay/ebay.component";

@Component({
  selector: 'app-internet',
  standalone: true,
  imports: [CommonModule, FormsModule, NotAVirusComponent, EbayComponent],
  templateUrl: './internet.component.html',
  styleUrl: './internet.component.css'
})
export class InternetComponent {
  websites: string[] = ['', 'https://www.notavirus.com', 'https://www.ebay.com'];
  selectedWebsite: string = '';
}
