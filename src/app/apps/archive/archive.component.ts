

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { V1Component } from './v1/v1.component';
import { V2Component } from './v2/v2.component';
import { V3Component } from './v3/v3.component';
import { V4Component } from './v4/v4.component';
import { V5Component } from './v5/v5.component';


@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.css'
})
export class ArchiveComponent {
  versions: Record<string, any> = {
    'latest': {
      component: V5Component,
      name: 'Before the great refactor',
      description: 'The last version before I decided to cut my losses and rewrite the app in Angular'
    },
    'y2k': {
      component: V4Component,
      name: 'Y2K Desktop',
      description: 'This is where I started cooking<br>Despite how it looks, this is at most 5% of the current version'
    },
    'rain': {
      component: V3Component,
      name: 'Cool Rain Effect',
      description: 'Third Version, dope rain effect<br>Lots of changes to other pages if I ever get around to making the archive artifacts fully functional'
    },
    'grid': {
      component: V2Component,
      name: 'Grid Layout',
      description: 'Second Version, googled "grid layout css"<br>MJ gif is peak I need to bring that back'
    },
    'v1': {
      component: V1Component,
      name: '1.0',
      description: 'First Version, was prob just testing deployment tbh, there\'s like nothing here. I do miss the dougie gif.'
    }
  };
  versionNames = Object.keys(this.versions);

  selectedVersion: string | undefined = undefined;

  switchVersion(version: string | undefined) {
    this.selectedVersion = version;
  }
}
