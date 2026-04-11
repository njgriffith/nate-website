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
        let windowWidth: number = window.innerWidth;
        let windowHeight: number = window.innerHeight;
        if (windowHeight >= windowWidth) {
            this.left = 0;
            this.top = 0;
        } else {
            this.left = Math.floor(Math.random() * windowWidth * 0.3);
            this.top = Math.floor(Math.random() * windowHeight * 0.2);
        }
    }
}