import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js'; // 1. Import

window.addEventListener('load', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.speed = 3; // Global game speed for scrolling
            this.background = new Background(this); // 2. Instantiate
            this.player = new Player(this.width, this.height);
            this.input = new InputHandler();
        }
        update() {
            this.background.update(); // 3. Update background
            this.player.update(this.input.keys);
        }
        draw(context) {
            this.background.draw(context); // 4. Draw background first
            this.player.draw(context);
        }
    }

    const game = new Game(canvas.width, canvas.height);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});