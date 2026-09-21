import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { AppService } from '../services/app.service';
import { StatsComponent } from '../apps/stats/stats.component';
import { MediaPlayerComponent } from "../apps/media-player/media-player.component";
import { SettingsComponent } from '../apps/settings/settings.component';
import { InternetComponent } from '../apps/internet/internet.component';
import { CatalogComponent } from '../apps/catalog/catalog.component';
import { App } from '../models/app.model';
import { WeatherComponent } from '../apps/weather/weather.component';
import { RecycleComponent } from '../apps/recycle/recycle.component';
import { ArchiveComponent } from '../apps/archive/archive.component';
import { User, UserService } from '../services/user.service';
import { LoginPopupComponent } from '../apps/login-popup/login-popup.component';
import { AdminComponent } from '../apps/admin/admin.component';
@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [CommonModule, DragDropModule, MediaPlayerComponent],
  templateUrl: './desktop.component.html',
  styleUrl: './desktop.component.css'
})

export class DesktopComponent {
  @Input() width: number | undefined = undefined;
  @Input() height: number | undefined = undefined;
  @Input() mobile: boolean = false;
  apps: App[] = [];
  openApps: App[] = [];
  backgroundImage: string = 'assets/backgrounds/metropolis.png';
  selectedIconIndex: number | undefined = undefined;
  mediaPlayer: App | undefined;
  isDraggingBox: boolean = false;
  puzzleTitle: string = 'Solve My Puzzle!';
  appsToRecycle: string[] = [];

  @ViewChild('rightClickBox') rightClickBoxRef!: ElementRef;
  box: HTMLElement | undefined = undefined;
  rightClickStartX: number = 0;
  rightClickStartY: number = 0;

  isLoggedIn: boolean = false;
  username: string = '';

  appComponentMap: Record<string, any> = {
    'Archive': ArchiveComponent,
    'Stats': StatsComponent,
    'Settings': SettingsComponent,
    'Internet': InternetComponent,
    'Catalog': CatalogComponent,
    'Weather': WeatherComponent,
    'Recycle': RecycleComponent,
    'Login': LoginPopupComponent,
    'Admin': AdminComponent
  };

  loadedAppComponentMap: Record<string, any> = {};

  lazyComponentLoaders: Record<string, () => Promise<any>> = {
    'Mine Nate Coin': () => import('../apps/mine-nate-coin/mine-nate-coin.component').then(m => m.MineNateCoinComponent),
    'Minesweeper': () => import('../apps/minesweeper/minesweeper.component').then(m => m.MinesweeperComponent),
    'Shape Store': () => import('../apps/shape-store/shape-store.component').then(m => m.ShapeStoreComponent),
    'Stuff I Like': () => import('../apps/stuff-i-like/stuff-i-like.component').then(m => m.StuffILikeComponent),
    'Puzzle': () => import('../apps/puzzle/puzzle.component').then(m => m.PuzzleComponent),
    'Command Line': () => import('../apps/command-line/command-line.component').then(m => m.CommandLine)
  };

  constructor(private appService: AppService, private userService: UserService) {
    this.loadedAppComponentMap = { ...this.appComponentMap };
  }

  ngOnInit() {
    this.appService.backgroundCode$.subscribe(code => this.updateBackground(code));
    this.appService.apps$.subscribe(apps => {
      this.apps = apps;
      this.openApps = this.apps.filter(app => app.isOpen);
      this.mediaPlayer = this.apps.find(app => app.name === 'Media Player');
    });
    this.appService.recycledApps$.subscribe((recycledApps: any[]) => {
      this.appsToRecycle = recycledApps.map(app => app.name);
    });
    this.userService.user$.subscribe((user: User) => {
      this.puzzleTitle = this.appService.levelTitles[user.puzzleLevel];
      this.isLoggedIn = user.isLoggedIn;
      this.username = user.username;
    });
  }

  ngAfterViewInit() {
    this.box = this.rightClickBoxRef.nativeElement;
  }

  async openApp(code: string) {
    if (this.lazyComponentLoaders[code] && !this.loadedAppComponentMap[code]) {
      const component = await this.lazyComponentLoaders[code]();
      this.loadedAppComponentMap[code] = component;
    }
    this.appService.openApp(code);
  }

  closeApp(code: string) {
    this.appService.closeApp(code);
  }
  minApp(code: string) {
    this.appService.minApp(code);
  }
  updateBackground(background: string) {
    if (background === 'virus') {
      this.backgroundImage = `assets/backgrounds/${background}.gif`;
      return;
    }
    this.backgroundImage = `assets/backgrounds/${background}.png`;
  }
  highlightApp(index: number) {
    this.selectedIconIndex = index;
    if (this.mobile) this.openApp(this.apps[index].name);
  }
  updateZIndex(code: App) {
    this.appService.updateZIndex(code.name);
  }

  trackByName(index: number, app: App) {
    return app.name;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyPress(event: any) {
    if (event.key !== 'Delete') return;
    const appsToRecycle: string[] = [];
    document.querySelectorAll('.highlighted-icon').forEach((icon: any) => {
      icon.classList.remove('highlighted-icon');
      const appName: string | undefined = icon.querySelector('p')?.innerText;
      if (appName) appsToRecycle.push(appName);
    });
    let highlightedApp: string | undefined = document.querySelector('.highlighted')?.querySelector('p')?.innerText;
    if (highlightedApp && highlightedApp !== 'Recycle') appsToRecycle.push(highlightedApp);
    this.appService.recycleApps(appsToRecycle);
  }

  boxDown(event: any) {
    if (event.button === 2) event.preventDefault();
    document.querySelectorAll('.highlighted-icon').forEach((icon: any) => {
      icon.classList.remove('highlighted-icon');
    });
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

    document.querySelectorAll('.icon').forEach((icon: any) => {
      if (icon.querySelector('p').innerText === 'Recycle') return;
      var iconLeft = icon.getBoundingClientRect().left + 40;
      var iconTop = icon.getBoundingClientRect().top + 40;
      if ((Math.min(currentX, this.rightClickStartX) <= iconLeft && iconLeft <= Math.max(currentX, this.rightClickStartX)) && (Math.min(currentY, this.rightClickStartY) <= iconTop && iconTop <= Math.max(currentY, this.rightClickStartY))) {
        icon.classList.add('highlighted-icon');
      }
      else {
        icon.classList.remove('highlighted-icon');
      }
    });
  }

  setPuzzleTitle(title: string) {
    this.puzzleTitle = title;
  }
}
