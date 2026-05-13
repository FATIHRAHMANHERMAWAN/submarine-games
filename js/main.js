import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { Enemy } from './enemy.js';

window.addEventListener('load', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    class Game {
        constructor(canvasElement) {
            this.width = canvasElement.width;
            this.height = canvasElement.height;
            this.speed = 2; 
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(canvasElement);

            // Shmup Entity Arrays
            this.projectiles = [];
            this.enemies = [];
            this.enemyProjectiles = [];

            // Spawn engines
            this.enemyTimer = 0;
            this.enemyInterval = 1500; // Spawns an enemy every 1.5 seconds
        }
        resize(newWidth, newHeight) {
            this.width = newWidth;
            this.height = newHeight;
        }
        update(deltaTime) {
            this.background.update();
            this.player.update(this.input, deltaTime);

            // 1. Process player torpedo updates
            this.projectiles.forEach(p => p.update());
            this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);

            // 2. Loop level spawn control engine
            this.enemyTimer += deltaTime;
            if (this.enemyTimer > this.enemyInterval) {
                this.enemies.push(new Enemy(this));
                this.enemyTimer = 0;
            }

            // 3. Process enemy tracking + collision logic
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                
                // Torpedo hits enemy
                this.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)) {
                        enemy.markedForDeletion = true;
                        projectile.markedForDeletion = true;
                    }
                });
            });
            this.enemies = this.enemies.filter(e => !e.markedForDeletion);

            // 4. Process enemy bullet paths + player collision
            this.enemyProjectiles.forEach(ep => {
                ep.update();
                if (this.checkCollision(ep, this.player)) {
                    ep.markedForDeletion = true;
                    console.log("Player Submarine Hit!"); // Structural collision hook position
                }
            });
            this.enemyProjectiles = this.enemyProjectiles.filter(ep => !ep.markedForDeletion);
        }
        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            
            // Execute batch render lists
            this.projectiles.forEach(p => p.draw(context));
            this.enemies.forEach(e => e.draw(context));
            this.enemyProjectiles.forEach(ep => ep.draw(context));
        }
        checkCollision(rect1, rect2) {
            // Checks bounds, adjusting for upscale differences automatically
            const w1 = rect1.renderWidth || rect1.width;
            const h1 = rect1.renderHeight || rect1.height;
            const w2 = rect2.renderWidth || rect2.width;
            const h2 = rect2.renderHeight || rect2.height;

            return (
                rect1.x < rect2.x + w2 &&
                rect1.x + w1 > rect2.x &&
                rect1.y < rect2.y + h2 &&
                rect1.y + h1 > rect2.y
            );
        }
    }

    const game = new Game(canvas);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.resize(canvas.width, canvas.height);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // High performance frame timestamp loop configuration
    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime || 0;
        lastTime = timeStamp;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
});