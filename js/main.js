import { Player } from './player.js';
import { InputHandler } from './input.js';

window.addEventListener('load', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    const player = new Player(canvas.width, canvas.height);
    const input = new InputHandler();

    function animate() {
        // Clear canvas with a dark ocean blue
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        player.update(input.keys);
        player.draw(ctx);

        requestAnimationFrame(animate);
    }
    
    animate();
});