import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AppService } from '../services/app.service';
import { StatsComponent } from '../apps/stats/stats.component';
import { BlogsComponent } from '../apps/blogs/blogs.component';
import { MediaPlayerComponent } from "../apps/media-player/media-player.component";
import { SettingsComponent } from '../apps/settings/settings.component';
import { InternetComponent } from '../apps/internet/internet.component';
import { CatalogComponent } from '../apps/catalog/catalog.component';
import { SignUpComponent } from '../apps/sign-up/sign-up.component';
import { MinesweeperComponent } from '../apps/minesweeper/minesweeper.component';
import { PuzzleComponent } from '../apps/puzzle/puzzle.component';
import { App } from '../models/app.model';
import { WeatherComponent } from '../apps/weather/weather.component';
import { RecycleComponent } from '../apps/recycle/recycle.component';
import { AdminComponent } from '../apps/admin/admin.component';
import { StuffILikeComponent } from '../apps/stuff-i-like/stuff-i-like.component';
import { ArchiveComponent } from '../apps/archive/archive.component';
@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [CommonModule, DragDropModule, MediaPlayerComponent],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.css'
})
// TODO: recycle, migrate all blogs, migrate all lists

export class DesktopComponent {
  @Input() mobile: boolean = false;
  apps: App[] = [];
  openApps: App[] = [];
  backgroundImage: string = 'assets/backgrounds/metropolis.png';
  selectedIconIndex: number | undefined = undefined;
  mediaPlayer: App | undefined;
  isDraggingBox: boolean = false;
  puzzleTitle: string = 'Solve My Puzzle!';

  @ViewChild('rightClickBox') rightClickBoxRef!: ElementRef;
  box: HTMLElement | undefined = undefined;
  rightClickStartX: number = 0;
  rightClickStartY: number = 0

  appComponentMap: Record<string, any> = {
    'Archive': ArchiveComponent,
    'Stuff I Like': StuffILikeComponent,
    'Stats': StatsComponent,
    'Settings': SettingsComponent,
    'Internet': InternetComponent,
    'Catalog': CatalogComponent,
    'Mailing List': SignUpComponent,
    'Minesweeper': MinesweeperComponent,
    'Puzzle': PuzzleComponent,
    'Weather': WeatherComponent,
    'Recycle': RecycleComponent,
    'Command Line': AdminComponent
  };

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.backgroundCode$.subscribe(code => this.updateBackground(code));
    this.appService.apps$.subscribe(apps => {
      this.apps = apps;
      this.openApps = this.apps.filter(app => app.isOpen);
      this.mediaPlayer = this.apps.find(app => app.name === 'Media Player');
    });
    this.appService.puzzleTitle$.subscribe(title => this.puzzleTitle = title);
  }

  ngAfterViewInit() {
    this.box = this.rightClickBoxRef.nativeElement;
  }

  openApp(code: string) {
    this.appService.openApp(code);
  }
  closeApp(code: string) {
    this.appService.closeApp(code);
  }
  minApp(code: string) {
    this.appService.minApp(code);
  }
  updateBackground(background: string) {
    this.backgroundImage = `assets/backgrounds/${background}.png`;
  }
  highlightApp(index: number) {
    this.selectedIconIndex = index;
  }
  updateZIndex(code: App) {
    this.appService.updateZIndex(code.name);
  }

  trackByName(index: number, app: App) {
    return app.name;
  }

  boxDown(event: any) {
    event.preventDefault();
    if (event.target.classList[0] !== 'desktop-icons' || !this.box) return;
    this.box.style.display = 'block';
    this.isDraggingBox = true;
    this.box.style.left = `${event.clientX}px`;
    this.box.style.top = `${event.clientY}px`;

    this.rightClickStartX = event.clientX;
    this.rightClickStartY = event.clientY;
    this.box.style.left = `${event.clientX}px`;
    this.box.style.top = `${event.clientY}px`;
  }

  boxUp() {
    this.isDraggingBox = false;
    if (!this.box) return;
    this.box.style.width = '0px';
    this.box.style.height = '0px';
    this.box.style.display = 'none';
  }

  dragBox(event: any) {
    if (!this.isDraggingBox || !this.rightClickBoxRef.nativeElement || !this.box) return;

    let currentX = event.clientX;
    let currentY = event.clientY;
    let width = Math.abs(event.clientX - this.rightClickStartX);
    let height = Math.abs(event.clientY - this.rightClickStartY);

    this.box.style.width = `${width}px`;
    this.box.style.height = `${height}px`;
    this.box.style.left = currentX < this.rightClickStartX ? `${currentX}px` : `${this.rightClickStartX}px`;
    this.box.style.top = currentY < this.rightClickStartY ? `${currentY}px` : `${this.rightClickStartY}px`;
  }

  setPuzzleTitle(title: string) {
    this.puzzleTitle = title;
  }
}
