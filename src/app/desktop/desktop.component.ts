import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppService } from '../services/app.service';
import { AlbumReviewsComponent } from '../apps/album-reviews/album-reviews.component';
import { ListsComponent } from '../apps/lists/lists.component';
import { StatsComponent } from '../apps/stats/stats.component';
import { BlogsComponent } from '../apps/blogs/blogs.component';
import { MediaPlayerComponent } from "../apps/media-player/media-player.component";
import { SettingsComponent } from '../apps/settings/settings.component';
import { InternetComponent } from '../apps/internet/internet.component';
import { CatalogComponent } from '../apps/catalog/catalog.component';
import { SignUpComponent } from '../apps/sign-up/sign-up.component';
import { MinesweeperComponent } from '../apps/minesweeper/minesweeper.component';
import { PuzzleComponent } from '../puzzle/puzzle.component';
import { App } from '../models/app.model';
import { WeatherComponent } from '../apps/weather/weather.component';
import { RecycleComponent } from '../apps/recycle/recycle.component';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [CommonModule, DragDropModule, MediaPlayerComponent],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.css'
})
  // TODO: recycle
  // extra credit: migrate all blogs, highlight sort on reviews, migrate all lists

export class DesktopComponent {
  apps: App[] = [];
  openApps: App[] = [];
  backgroundImage: string = 'assets/backgrounds/metropolis.png';
  selectedIconIndex: number | undefined = undefined;
  mediaPlayer: App | undefined;
  isDraggingBox: boolean = false;

  @ViewChild('rightClickBox') rightClickBoxRef!: ElementRef;

  appComponentMap: Record<string, any> = {
    'Blog': BlogsComponent,
    'Album Reviews': AlbumReviewsComponent,
    'Lists': ListsComponent,
    'Stats': StatsComponent,
    'Settings': SettingsComponent,
    'Internet': InternetComponent,
    'Catalog': CatalogComponent,
    'Mailing List': SignUpComponent,
    'Minesweeper': MinesweeperComponent,
    'Solve My Puzzle': PuzzleComponent,
    'Weather': WeatherComponent,
    'Recycle': RecycleComponent
  };

  constructor(private appService: AppService) {}

  ngOnInit(){
    this.appService.backgroundCode$.subscribe(code => this.updateBackground(code));
    this.appService.apps$.subscribe(apps => {
      this.apps = apps;
      this.openApps = this.apps.filter(app => app.isOpen);
      this.mediaPlayer = this.apps.find(app => app.name === 'Media Player');
    });
  }

  openApp(code: string){
    this.appService.openApp(code);
  }
  closeApp(code: string){
    this.appService.closeApp(code);
  }
  minApp(code: string){
    this.appService.minApp(code);
  }
  updateBackground(background: string){
    this.backgroundImage = `assets/backgrounds/${background}.png`;
  }
  highlightApp(index: number) {
    this.selectedIconIndex = index;
  }
  updateZIndex(code: App){
    this.appService.updateZIndex(code.name);
  }

  trackByName(index: number, app: App) {
    return app.name;
  }

  boxDown(event: any){
    this.isDraggingBox = true;
    const box = this.rightClickBoxRef.nativeElement;
    box.style.left = `${event.clientX}px`;
    box.style.top = `${event.clientY}px`;
  }

  dragBox(event: any){
    if (!this.isDraggingBox || !this.rightClickBoxRef.nativeElement) return;
    const box = this.rightClickBoxRef.nativeElement;
    box.style.width = '100px';
    box.style.height = '100px';
  }
}
