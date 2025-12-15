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
  @ViewChild('player1', { static: true }) player1Ref!: ElementRef<HTMLAudioElement>;
  @ViewChild('player2', { static: true }) player2Ref!: ElementRef<HTMLAudioElement>;
  player1: HTMLAudioElement | null = null;
  player2: HTMLAudioElement | null = null;

  ngOnInit() {
    this.player1 = this.player1Ref.nativeElement;
    this.player2 = this.player2Ref.nativeElement;
  }

  play(n: number) {
    if (!this.player1 || !this.player2) return;

    if (n === 1) this.player1.play();
    else if (n === 2) this.player2.play();
  }

}
