import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Shape, ShapeTypes, Vertex } from '../../models/shape.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shape-store',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './shape-store.component.html',
  styleUrl: './shape-store.component.css'
})
export class ShapeStoreComponent implements AfterViewInit, OnDestroy {
  width: number = 600;
  halfWidth: number = this.width / 2;
  height: number = 600;
  size: number = 10;
  halfSize: number = this.size / 2;
  fps: number = 60;
  rpm: number = 12;
  dTheta = (this.rpm / 60) * Math.PI;
  angle: number = 0;
  axes: string[] = ['xz', 'yz', 'xy'];
  rotationAxis: string = this.axes[0];
  cameraDistance: number = 1;
  animationFrameId: number | null = null;

  selectedShape: ShapeTypes = ShapeTypes.TORUS;
  shapeOptions: ShapeTypes[] = Object.keys(ShapeTypes).filter((v): v is string => isNaN(Number(v))).map((v) => ShapeTypes[v as keyof typeof ShapeTypes]);
  shapeColor: string = "#0f0";

  shape!: Shape;
  vertices: Vertex[] = [];
  faces: number[][] = [];
  shapePrice: number = 0;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  canvasElement!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;

  updateRPM() {
    this.dTheta = (this.rpm / 60) * Math.PI;
  }

  updateShapeSelection() {
    this.shape = new Shape(this.selectedShape);
    this.vertices = this.shape.vertices;
    this.faces = this.shape.faces;
    this.cameraDistance = this.shape.cameraDistance;
    this.shapePrice = this.shape.price;
  }

  updateShapeColor(){
    // todo maybe
  }

  ngOnInit() {
    this.updateShapeSelection();
  }

  ngAfterViewInit() {
    // get width of container element and set canvas width to match
    this.width = this.canvas.nativeElement.parentElement?.clientWidth || this.width;
    this.halfWidth = this.width / 2;
    this.height = this.canvas.nativeElement.parentElement?.clientHeight || this.height;

    this.canvasElement = this.canvas.nativeElement;
    this.ctx = this.canvasElement.getContext('2d')!;

    this.canvasElement.width = this.width;
    this.canvasElement.height = this.height;

    this.clear();
    this.startAnimation();
  }


  startAnimation() {
    const loop = () => {
      this.frame();
      this.angle = (this.angle + this.dTheta / this.fps) % (2 * Math.PI);
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  frame() {
    this.clear();
    // this.vertices.forEach((v: Vertex) => {
    //   this.drawVertex(this.convertCoords(this.project3D(this.rotate(v, this.angle))));
    // });
    this.faces.forEach((face: number[]) => {
      for (let i = 0; i < face.length; i++) {
        let a = this.vertices[face[i]];
        let b = this.vertices[face[(i + 1) % face.length]];
        this.drawLine(
          this.convertCoords(this.project3D(this.rotate(a, this.angle))),
          this.convertCoords(this.project3D(this.rotate(b, this.angle))),
        );
      }
    });
  }

  drawLine(v1: Vertex, v2: Vertex) {
    this.ctx.strokeStyle = this.shapeColor;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(v1.x, v1.y);
    this.ctx.lineTo(v2.x, v2.y);
    this.ctx.stroke();
  }

  clear() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawVertex(v: Vertex) {
    this.ctx.fillStyle = this.shapeColor;
    this.ctx.fillRect(v.x, v.y, this.size, this.size);
  }

  convertCoords(v: Vertex): Vertex {
    return { x: this.halfWidth * (v.x + 1) - this.halfSize, y: this.height * (1 - ((v.y + 1) / 2)) - this.halfSize, z: v.z }
  }

  project3D(v: Vertex): Vertex {
    return { x: v.x / v.z, y: v.y / v.z, z: v.z };
  }

  rotate(v: Vertex, angle: number): Vertex {
    let c: number = Math.cos(angle);
    let s: number = Math.sin(angle);

    if (this.rotationAxis === 'xz') {
      return {
        x: v.x * c - v.z * s,
        y: v.y,
        z: v.x * s + v.z * c + this.cameraDistance
      }
    }
    else if (this.rotationAxis === 'yz') {
      return {
        x: v.x,
        y: v.y * c - v.z * s,
        z: v.y * s - v.z * c + this.cameraDistance
      }
    }
    else if (this.rotationAxis === 'xy') {
      return {
        x: v.x * c - v.y * s,
        y: v.x * s + v.y * c,
        z: v.z + this.cameraDistance
      }
    }
    return {x: v.x, y: v.y, z: v.z + this.cameraDistance}
  }

  ngOnDestroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
