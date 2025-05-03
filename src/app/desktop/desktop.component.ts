import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [CommonModule, DragDropModule, MediaPlayerComponent],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.css'
})
export class DesktopComponent {
  apps: string[] = ['Blogs', 'Album Reviews', 'Lists', 'Solve My Puzzle', 'Stats', 'Media Player', 'Internet', 'Catalog', 'Settings', 'Sign Up!', 'Weather', 'Minesweeper', 'Recycle'];
  openApps: string[] = [];
  // TODO: puzzle, weather, recycle
  
  // extra credit: migrate all blogs, highlight sort on reviews, migrate all lists, media player seek
  backgroundImage: string = 'assets/backgrounds/metropolis.png';
  selectedIconIndex: number | undefined = undefined;

  appComponentMap: Record<string, any> = {
    'Blogs': BlogsComponent,
    'Album Reviews': AlbumReviewsComponent,
    'Lists': ListsComponent,
    'Stats': StatsComponent,
    'Settings': SettingsComponent,
    'Internet': InternetComponent,
    'Catalog': CatalogComponent,
    'Sign Up!': SignUpComponent,
    'Minesweeper': MinesweeperComponent,
    'Solve My Puzzle': PuzzleComponent
  };

  constructor(private appService: AppService) {}

  ngOnInit(){
    this.appService.backgroundCode$.subscribe(code => this.updateBackground(code));

    this.appService.openApps$.subscribe(apps => {
      this.openApps = apps;
    });
  }

  openApp(code: string){
    this.appService.openApp(code);
  }
  closeApp(code: string){
    this.appService.closeApp(code);
  }
  minApp(code: string){
    
  }
  updateBackground(background: string){
    this.backgroundImage = `assets/backgrounds/${background}.png`;
  }

  highlightApp(index: number) {
    this.selectedIconIndex = index;
  }
}
