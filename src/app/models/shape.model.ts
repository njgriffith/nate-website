export enum ShapeTypes{
    CUBE = "CUBE",
    PYRAMID = "PYRAMID",
    HEX_LOG = "HEX_LOG"
}

export interface Vertex{
  x: number,
  y: number,
  z: number
}

export class Shape{
    vertices!: Vertex[];
    faces!: number[][];
    price!: number;
    constructor(type: ShapeTypes){
        if (type === ShapeTypes.CUBE){
            this.vertices = [
            {x: 0.25, y: 0.25, z: 0.25},
            {x: -0.25, y: 0.25, z: 0.25},
            {x: -0.25, y: -0.25, z: 0.25},
            {x: 0.25, y: -0.25, z: 0.25},

            {x: 0.25, y: 0.25, z: -0.25},
            {x: -0.25, y: 0.25, z: -0.25},
            {x: -0.25, y: -0.25, z: -0.25},
            {x: 0.25, y: -0.25, z: -0.25}
            ];
            this.faces = [
                [0, 1, 2, 3],
                [4, 5, 6, 7],
                [0, 4],
                [1, 5],
                [2, 6],
                [3, 7]
            ];
            this.price = 500;
        }
        else if (type === ShapeTypes.PYRAMID){
            this.vertices = [
                {x: 0.25, y: -0.5, z: 0.25},
                {x: -0.25, y: -0.5, z: 0.25},
                {x: -0.25, y: -0.5, z: -0.25},
                {x: 0.25, y: -0.5, z: -0.25},
              
                {x: 0, y: 0.5, z: 0}
            ];
            this.faces = [
                [0, 1, 2, 3],
                [0, 4],
                [1, 4],
                [2, 4],
                [3, 4]
            ];
            this.price = 800;
        }
        else if (type === ShapeTypes.HEX_LOG){
            this.vertices = [
                {x: 0.25, y: 0.25, z: 0.5},
                {x: -0.25, y: 0.25, z: 0.5},
                {x: -0.4, y: 0, z: 0.5},
                {x: -0.25, y: -0.25, z: 0.5},
                {x: 0.25, y: -0.25, z: 0.5},
                {x: 0.4, y: 0, z: 0.5},

                {x: 0.25, y: 0.25, z: -0.5},
                {x: -0.25, y: 0.25, z: -0.5},
                {x: -0.4, y: 0, z: -0.5},
                {x: -0.25, y: -0.25, z: -0.5},
                {x: 0.25, y: -0.25, z: -0.5},
                {x: 0.4, y: 0, z: -0.5},
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
            this.price = 1050;
        }
    }
}
