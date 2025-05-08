import { CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-media-player',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './media-player.component.html',
  styleUrl: './media-player.component.css'
})
export class MediaPlayerComponent {

  constructor(private appService: AppService) { }

  drawerDistance: number = 200;

  rightHovered = false;
  rightOpened = true;
  leftHovered = false;
  leftOpened = true;
  rightOffset: string = '400px';
  leftOffset: string = '-255px';

  songs: any = [
    ['Cult Member', 'one'],
    ['boy2000', 'savestate'],
    ['Cult Member', 'ov_dreams'],
    ['Zorrovian', 'event_horizon']
  ];

  currentSongIndex = 0;
  currentArtist = '';
  currentSong = '';

  @ViewChild('progressBar') progressBarRef!: ElementRef;
  @ViewChild('progressThumb', { read: CdkDrag }) progressThumb!: CdkDrag;
  @ViewChild('player', { static: true }) playerRef!: ElementRef<HTMLAudioElement>;
  player: HTMLAudioElement | null = null;
  progressBar: HTMLElement | null = null;

  isDragging = false;
  timeShift = 0;

  ngAfterViewInit() {
    this.player = this.playerRef.nativeElement;
    this.progressBar = this.progressBarRef.nativeElement;
  }
  minApp() {
    this.appService.minApp('Media Player');
  }
  closeApp() {
    this.appService.closeApp('Media Player');
  }

  handleMediaEvent(event: string) {
    if (!this.player) return;
    if (event === 'play') {
      if (!this.player.src.includes(`${this.songs[this.currentSongIndex][1]}`)) {
        this.player.src = `assets/music/${this.songs[this.currentSongIndex][1]}.mp3`;
        this.player.load();
      }
      this.player.play();
      this.currentArtist = this.songs[this.currentSongIndex][0];
      this.currentSong = this.songs[this.currentSongIndex][1];
    }
    else if (event === 'pause') {
      this.player.pause();
    }
    else if (event === 'next') {
      this.currentSongIndex++;
      if (this.currentSongIndex === this.songs.length) {
        this.currentSongIndex = 0;
      }
      this.handleMediaEvent('play');
    }
    else if (event === 'prev') {
      this.currentSongIndex--
      if (this.currentSongIndex < 0) {
        this.currentSongIndex = this.songs.length - 1;
      }
      this.handleMediaEvent('play');
    }
  }

  getRightSource(): string {
    if (this.rightHovered && this.rightOpened) {
      return 'assets/head/R_drwr_close_02_rollover.bmp';
    }
    if (this.rightHovered && !this.rightOpened) return 'assets/head/R_drwr_open_02_rollover.bmp';
    if (!this.rightHovered && this.rightOpened) return 'assets/head/R_drwr_close_01_default.bmp';
    return 'assets/head/R_drwr_open_01_default.bmp';
  }

  getLeftSource(): string {
    if (this.leftHovered && this.leftOpened) return 'assets/head/L_drwr_close_02_rollover.bmp';
    if (this.leftHovered && !this.leftOpened) return 'assets/head/L_drwr_open_02_rollover.bmp';
    if (!this.leftHovered && this.leftOpened) return 'assets/head/L_drwr_close_01_default.bmp';
    return 'assets/head/L_drwr_open_01_default.bmp';
  }

  toggleEar(ear: string) {
    if (ear === 'l' && this.leftOpened) {
      this.leftOffset = `${parseInt(this.leftOffset) - this.drawerDistance}px`;
    }
    else if (ear === 'l' && !this.leftOpened) {
      this.leftOffset = `${parseInt(this.leftOffset) + this.drawerDistance}px`
    }

    else if (ear === 'r' && this.rightOpened) {
      this.rightOffset = `${parseInt(this.rightOffset) + this.drawerDistance}px`;
    }
    else if (ear === 'r' && !this.rightOpened) {
      this.rightOffset = `${parseInt(this.rightOffset) - this.drawerDistance}px`
    }
  }

  updateProgressBar(event: any) {
    if (!this.player || !this.progressBarRef || this.isDragging) return;
    if (Number.isNaN(this.player.duration)) return;

    const barRect = this.progressBarRef.nativeElement.getBoundingClientRect();
    const barWidth = barRect.right - barRect.left;

    const percentage = this.player.currentTime / this.player.duration;
    const translateX = barWidth * percentage;

    this.progressThumb.setFreeDragPosition({ x: translateX, y: 0 });
  }

  onDragStart(event: any) {
    this.isDragging = true;
  }

  seekTrack(event: any) {
    if (!this.player || !this.player.duration || !this.progressThumb) return;

    const dragPos = this.progressThumb.getFreeDragPosition();
    const barRect = this.progressBarRef.nativeElement.getBoundingClientRect();

    const barWidth = barRect.right - barRect.left;
    const percentage = dragPos.x / barWidth;

    this.player.currentTime = this.player.duration * percentage;
    this.isDragging = false;
  }

  audioEnded() {
    this.currentSongIndex++;
    if (this.currentSongIndex === this.songs.length) {
      this.currentSongIndex = 0;
    }
    this.handleMediaEvent('play');
  }
}
