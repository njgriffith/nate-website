import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-level-3',
  standalone: true,
  imports: [],
  templateUrl: './level-3.component.html',
  styleUrl: './level-3.component.css'
})
export class Level3Component {
  @ViewChild('player', { static: true }) playerRef!: ElementRef<HTMLAudioElement>;
  player: HTMLAudioElement | null = null;

  ngOnInit() {
    this.player = this.playerRef.nativeElement;
  }

  playMedia() {
    if (!this.player) return;
    this.player.play();
  }

  pauseAudio() {
    if (!this.player) return;
    this.player.pause();
  }
}
