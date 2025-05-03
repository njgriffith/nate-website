import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {
  catalogSize: number = 7;
  currentIndex: number = 1;

  descSource: string = 'assets/catalog/00' + this.currentIndex + '.txt';
  imageSource: string = 'assets/catalog/00' + this.currentIndex + '.gif';
  creatureDesc: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadFile(this.descSource);
  }


  loadFile(path: string) {
    this.http.get(path, { responseType: 'text' }).subscribe({
      next: content => this.creatureDesc = content,
      error: err => console.error('Error loading file:', err)
    });
  }


  prev() {
    this.currentIndex--;
    if (this.currentIndex === 0) this.currentIndex = this.catalogSize;
    this.descSource = 'assets/catalog/00' + this.currentIndex + '.txt';
    this.imageSource = 'assets/catalog/00' + this.currentIndex + '.gif';
    this.loadFile(this.descSource);
  }

  next() {
    this.currentIndex++;
    if (this.currentIndex > this.catalogSize) this.currentIndex = 1;
    this.descSource = 'assets/catalog/00' + this.currentIndex + '.txt';
    this.imageSource = 'assets/catalog/00' + this.currentIndex + '.gif';
    this.loadFile(this.descSource);
  }
}
