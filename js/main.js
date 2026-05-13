import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';

window.addEventListener('load', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.speed = 3; 
            this.background = new Background(this);
            this.player = new Player(this.width, this.height);
            this.input = new InputHandler();
        }
        // New method to handle resizing internally
        resize(newWidth, newHeight) {
            this.width = newWidth;
            this.height = newHeight;
            this.player.gameWidth = newWidth;
            this.player.gameHeight = newHeight;
            // Background will naturally stretch in its draw method
        }
        update() {
            this.background.update();
            this.player.update(this.input.keys);
        }
        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
        }
    }

    // 1. Initialize the game FIRST
    const game = new Game(window.innerWidth, window.innerHeight);

    // 2. Define resize function AFTER game is created
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.resize(canvas.width, canvas.height);
    }

    // 3. Set up listeners
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Now this is safe to call

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});