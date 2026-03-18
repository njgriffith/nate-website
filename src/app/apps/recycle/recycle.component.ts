import { Component } from '@angular/core';
import { App } from '../../models/app.model';
import { CommonModule } from '@angular/common';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-recycle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recycle.component.html',
  styleUrl: './recycle.component.css'
})
export class RecycleComponent {
  recycledApps: any[] = [];
	constructor(private appService: AppService){ }
	ngOnInit(){
		this.appService.recycledApps$.subscribe((apps: string[]) => {
      this.recycledApps = apps;
    });
	}

  restoreApp(appName: string){
    this.recycledApps = this.recycledApps.filter(app => app.name !== appName);
    this.appService.restoreApp(appName);
  }
}
