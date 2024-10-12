const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Rain {
    constructor(x, height, width, speed) {
        this.x = x;
        this.y = 0;
        this.height = height;
        this.width = width;
        this.speed = speed;
    }
}

const drops = [];
for (let i = 0; i < 50; i++) {
    drops.push(new Rain(getRandomInt(canvas.width), getRandomInt(60) + 10, getRandomInt(7) + 2, getRandomInt(7) + 4));
}
function draw() {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drops.forEach(function (drop) {
        ctx.fillStyle = '#8849cc';
        ctx.fillRect(drop.x, drop.y, drop.width, drop.height);
        drop.y += drop.speed;

        // loop to top
        if (drop.y > canvas.height) {
            drop.y = -drop.height;
        }
    });

    // loop
    requestAnimationFrame(draw);
}
draw();
