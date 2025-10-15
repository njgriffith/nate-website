import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-level-10',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './level-10.component.html',
  styleUrl: './level-10.component.css'
})
export class Level10Component {
  sentence: string = 'thequickbrownfoxjumpedoverthelazydog';
  alpha: string = 'abcdefghijklmnopqrstuvwxyz';

}
