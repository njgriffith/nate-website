export class App{
    name: string;
    isOpen: boolean;
    isMinimized: boolean;
    zIndex: number;
    left: number;
    top: number;

    constructor(name: string, open: boolean, minimized: boolean, zIndex: number){
        this.name = name;
        this.isOpen = open;
        this.isMinimized = minimized;
        this.zIndex = zIndex;
        this.left = Math.floor(200 + (Math.random() * 600));
        this.top = Math.floor((Math.random() * 500));
    }
}