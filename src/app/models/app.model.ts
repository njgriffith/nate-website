export class App{
    name: string;
    isOpen: boolean;
    isMinimized: boolean;
    zIndex: number;
    left: number;
    top: number;

    constructor(name: string, open: boolean, minimized: boolean, zIndex: number, mobile: boolean = false){
        this.name = name;
        this.isOpen = open;
        this.isMinimized = minimized;
        this.zIndex = zIndex;
        if (mobile) {
            this.left = 0;
            this.top = 0;
        } else {
            this.left = Math.floor(200 + (Math.random() * 600));
            this.top = Math.floor((Math.random() * 500));
        }
    }
}