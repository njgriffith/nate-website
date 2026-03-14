import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-v3',
  standalone: true,
  imports: [],
  templateUrl: './v3.component.html',
  styleUrl: './v3.component.css'
})
export class V3Component implements AfterViewInit {
  canvas?: HTMLCanvasElement;
  ctx?: CanvasRenderingContext2D;
  drops: any[] = [];

  ngAfterViewInit() {
    this.canvas = document.getElementById('rainCanvas') as HTMLCanvasElement;
    if (!this.canvas) {
      return;
    }
    const grid = document.querySelector('.grid-container') as HTMLElement;
    if (!grid) return;
    this.canvas.width = grid.clientWidth;
    this.canvas.height = grid.clientHeight;
    this.ctx = this.canvas.getContext('2d') ?? undefined;
    if (!this.ctx) {
      return;
    }
    this.drops = Array.from({ length: 100 }, () => this.createRain());
    this.draw();
  }


  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  createRain() {
    const rain = {
      x: this.getRandomInt(this.canvas!.width),
      y: - (this.getRandomInt(60) + 10),
      height: this.getRandomInt(60) + 10,
      width: this.getRandomInt(7) + 2,
      speed: this.getRandomInt(7) + 4
    };
    return rain;
  }

  draw() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drops.forEach((drop: any) => {
      if (!this.ctx || !this.canvas) return;
      this.ctx.fillStyle = '#8849cc';
      this.ctx.fillRect(drop.x, drop.y, drop.width, drop.height);
      drop.y += drop.speed;

      // loop to top
      if (drop.y > this.canvas.height) {
        drop.y = -drop.height;
        drop.x = this.getRandomInt(this.canvas.width);
      }
    });
    requestAnimationFrame(() => this.draw());
  }
}
