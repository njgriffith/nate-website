import { Component } from '@angular/core';
import { App } from '../../models/app.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recycle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recycle.component.html',
  styleUrl: './recycle.component.css'
})
export class RecycleComponent {
  deletedApps: string[] = ['test'];
}
