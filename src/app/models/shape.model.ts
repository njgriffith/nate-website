export enum ShapeTypes {
    CUBE = "CUBE",
    PYRAMID = "PYRAMID",
    HEX_LOG = "HEX_LOG",
    SPHERE = "SPHERE",
    WHEEL = "WHEEL",
    TORUS = "TORUS"
}

export interface Vertex {
    x: number,
    y: number,
    z: number
}

export class Shape {
    vertices!: Vertex[];
    faces!: number[][];
    price!: number;
    cameraDistance: number = 1;
    constructor(type: ShapeTypes) {
        if (type === ShapeTypes.CUBE) {
            this.vertices = [
                { x: 0.25, y: 0.25, z: 0.25 },
                { x: -0.25, y: 0.25, z: 0.25 },
                { x: -0.25, y: -0.25, z: 0.25 },
                { x: 0.25, y: -0.25, z: 0.25 },

                { x: 0.25, y: 0.25, z: -0.25 },
                { x: -0.25, y: 0.25, z: -0.25 },
                { x: -0.25, y: -0.25, z: -0.25 },
                { x: 0.25, y: -0.25, z: -0.25 }
            ];
            this.faces = [
                [0, 1, 2, 3],
                [4, 5, 6, 7],
                [0, 4],
                [1, 5],
                [2, 6],
                [3, 7]
            ];
        }
        else if (type === ShapeTypes.PYRAMID) {
            this.vertices = [
                { x: 0.25, y: -0.5, z: 0.25 },
                { x: -0.25, y: -0.5, z: 0.25 },
                { x: -0.25, y: -0.5, z: -0.25 },
                { x: 0.25, y: -0.5, z: -0.25 },

                { x: 0, y: 0.5, z: 0 }
            ];
            this.faces = [
                [0, 1, 2, 3],
                [0, 4],
                [1, 4],
                [2, 4],
                [3, 4]
            ];
        }
        else if (type === ShapeTypes.HEX_LOG) {
            this.vertices = [
                { x: 0.25, y: 0.25, z: 0.5 },
                { x: -0.25, y: 0.25, z: 0.5 },
                { x: -0.4, y: 0, z: 0.5 },
                { x: -0.25, y: -0.25, z: 0.5 },
                { x: 0.25, y: -0.25, z: 0.5 },
                { x: 0.4, y: 0, z: 0.5 },

                { x: 0.25, y: 0.25, z: -0.5 },
                { x: -0.25, y: 0.25, z: -0.5 },
                { x: -0.4, y: 0, z: -0.5 },
                { x: -0.25, y: -0.25, z: -0.5 },
                { x: 0.25, y: -0.25, z: -0.5 },
                { x: 0.4, y: 0, z: -0.5 },
            ];
            this.faces = [
                [0, 1, 2, 3, 4, 5, 0],
                [6, 7, 8, 9, 10, 11, 6],
                [0, 6],
                [1, 7],
                [2, 8],
                [3, 9],
                [4, 10],
                [5, 11]
            ];
        }
        else if (type === ShapeTypes.SPHERE) {
            this.vertices = [];
            this.faces = [];
            let res: number = 15;
            let radius: number = 1;

            for (let i = 0; i < res; i++) {
                let xyRadius = radius * Math.sin(i * Math.PI / res);
                for (let j = 0; j < res; j++) {
                    this.vertices.push({ x: xyRadius * Math.cos(j * 2 * Math.PI / res), y: xyRadius * Math.sin(j * 2 * Math.PI / res), z: radius * Math.cos(i * Math.PI / res) });
                }
                let temp: number[] = [];
                for (let j = 0; j < res; j++) {
                    temp.push(res * i + j);
                }
                this.faces.push(temp);
            }
            for (let i = 0; i < res; i++) {
                let temp: number[] = [];
                for (let j = 0; j < res; j++) {
                    temp.push(j * res + i);
                }
                this.faces.push(temp);
            }
            this.cameraDistance = 2;
        }
        else if (type === ShapeTypes.WHEEL) {
            this.vertices = [];
            this.faces = [];
            let res: number = 15;
            let depth: number = 2;
            let radius: number = 1;
            let z: number = 0.25;
            let dz: number = 0.5;
            let temp: number[] = [];

            for (let i = 0; i < depth; i++) {
                for (let j = 0; j < res; j++) {
                    this.vertices.push({ x: radius * Math.cos(j * 2 * Math.PI / res), y: radius * Math.sin(j * 2 * Math.PI / res), z: z });
                }
                temp = [];
                for (let j = 0; j < res; j++) {
                    temp.push(res * i + j);
                }
                this.faces.push(temp);
                z += dz;
            }
            radius = 0.2;
            z = 0.25;
            let indexShiftAfterOuter: number = this.vertices.length;
            for (let i = 0; i < depth; i++) {
                for (let j = 0; j < res; j++) {
                    this.vertices.push({ x: radius * Math.cos(j * 2 * Math.PI / res), y: radius * Math.sin(j * 2 * Math.PI / res), z: z });
                }
                temp = [];
                for (let j = 0; j < res; j++) {
                    temp.push(res * i + j + indexShiftAfterOuter);
                }
                this.faces.push(temp);
                z += dz;
            }
            for (let i = 0; i < res; i++) {
                temp = [];
                for (let j = 0; j < depth; j++) {
                    temp.push(j * res + i);
                }
                this.faces.push(temp);
            }
            for (let i = 0; i < res; i++) {
                temp = [];
                for (let j = 0; j < depth; j++) {
                    temp.push(j * res + i + indexShiftAfterOuter);
                }
                this.faces.push(temp);
            }
            for (let i = 0; i < res * 2; i++) {
                this.faces.push([i, i + res * 2]);
            }
            this.cameraDistance = 2;
        }
        else if (type === ShapeTypes.TORUS) {
            this.vertices = [];
            this.faces = [];
            let res: number = 15;
            let radius: number = 1;
            let tubeRadius: number = 0.25;

            for (let i = 0; i < res; i++) {
                let xyRadius = radius + tubeRadius * Math.cos(i * 2 * Math.PI / res);
                for (let j = 0; j < res; j++) {
                    this.vertices.push({ x: xyRadius * Math.cos(j * 2 * Math.PI / res), y: xyRadius * Math.sin(j * 2 * Math.PI / res), z: tubeRadius * Math.sin(i * 2 * Math.PI / res) });
                }
                let temp: number[] = [];
                for (let j = 0; j < res; j++) {
                    temp.push(res * i + j);
                }
                this.faces.push(temp);
            }
            for (let i = 0; i < res; i++) {
                let temp: number[] = [];
                for (let j = 0; j < res; j++) {
                    temp.push(j * res + i);
                }
                this.faces.push(temp);
            }
            this.cameraDistance = 2;
        }
        this.price = this.vertices.length * 50;
    }
}
