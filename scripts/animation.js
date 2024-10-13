// GLOBAL STUFF
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let animationFrameId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// PURPLE RAIN
class Rain {
    constructor() {
        this.x = getRandomInt(canvas.width);
        this.y = getRandomInt(canvas.height);
        this.height = getRandomInt(60) + 10;
        this.width = getRandomInt(7) + 2;
        this.speed = getRandomInt(7) + 4;
    }
}
let drops = [];
let isRaining = false;


function purpleRain() { 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(!isRaining) return;

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
    frameId = requestAnimationFrame(purpleRain);
}
function toggleRain() {
    if (isRaining) {
        cancelAnimationFrame(animationFrameId);
        isRaining = false;
        document.getElementById('rainButton').innerText = 'Purple Rain';
        drops = [];
    } 
    else {
        for (let i = 0; i < 150; i++) {
            drops.push(new Rain());
        }
        isRaining = true;
        document.getElementById('rainButton').innerText = 'Stop';
        purpleRain();
    }
}
