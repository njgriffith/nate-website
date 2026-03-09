import { CdkDrag, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { AppService } from '../../services/app.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-media-player',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './media-player.component.html',
  styleUrl: './media-player.component.css'
})
export class MediaPlayerComponent implements OnInit, OnDestroy {

  constructor(private appService: AppService, private cdr: ChangeDetectorRef) { }

  private destroy$ = new Subject<void>();
  baseZIndex: number = 1;
  drawerDistance: number = 200;

  rightHovered = false;
  rightOpened = true;
  leftHovered = false;
  leftOpened = true;
  rightOffset: string = '200px';
  leftOffset: string = '-55px';

  songs: [string, string, string][] = [
    ['Cult Member', 'one', '6:38'],
    ['boy2000', 'savestate', '2:34'],
    ['Cult Member', 'ov_dreams', '5:09'],
    ['Zorrovian', 'event_horizon', '2:13'],
    ['boy2000', 'zero', '2:10'],
    ['Zorrovian', 'bios', '5:12'],
    ['mishoangelo', '4am', '3:47'],
    ['Eulogy', 'logic', '3:42'],
    ['Bakground', 'gotham_love', '4:34'],
    ['Cult Member', 'untitled_side_a', '4:59'],
    ['Cult Member', 'untitled_side_b', '7:18']
  ];

  currentSongIndex = 0;
  currentArtist = '';
  currentSong = '';
  isSongPlaying = false;

  @ViewChild('progressBar') progressBarRef!: ElementRef;
  @ViewChild('progressThumb', { read: CdkDrag }) progressThumb!: CdkDrag;
  @ViewChild('player', { static: true }) playerRef!: ElementRef<HTMLAudioElement>;
  player: HTMLAudioElement | null = null;
  progressBar: HTMLElement | null = null;

  isDragging = false;
  timeShift = 0;

  ngOnInit() {
    this.appService.apps$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(apps => {
      const mediaPlayerApp = apps.find(app => app.name === 'Media Player');
      if (mediaPlayerApp) {
        this.baseZIndex = mediaPlayerApp.zIndex;
        this.cdr.detectChanges();
      }
    });
    setTimeout(() => {
      this.toggleEar('l');
      this.toggleEar('r');
    }, 500);
  }

  ngAfterViewInit() {
    this.player = this.playerRef.nativeElement;
    this.progressBar = this.progressBarRef.nativeElement;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
      this.isSongPlaying = true;
    }
    else if (event === 'pause') {
      this.player.pause();
      this.isSongPlaying = false;
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
  updateZIndex(appCode: string){
    console.log(this.baseZIndex);
    this.appService.updateZIndex(appCode);
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
