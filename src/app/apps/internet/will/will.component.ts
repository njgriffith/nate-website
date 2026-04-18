import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-will',
  standalone: true,
  imports: [NgIf],
  templateUrl: './will.component.html',
  styleUrl: './will.component.css'
})
export class WillComponent {
  private _url: string = '';
  safeUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  @Input()
  set url(url: string) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  get url(): string {
    return this._url;
  }
}
