import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { Enemy } from './enemy.js';
import { Particle } from './particle.js';
import { UI } from './UI.js'; // New import

window.addEventListener('load', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    class Game {
        constructor(canvasElement) {
            this.width = canvasElement.width;
            this.height = canvasElement.height;
            this.speed = 2; 

            this.gameState = 'home';
            this.score = 0;
            this.victoryCondition = 5;
            this.lives = 5;
            this.showInfo = false;

            // Audio
            this.bgMusic = new Audio('src/backsound.mp3');
            this.bgMusic.loop = true;
            this.bgMusic.volume = 0.4; 
            this.shootSound = new Audio('src/torpedosound.ogg');
            this.shootSound.volume = 0.5;

            // Modules
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(canvasElement);
            this.ui = new UI(this); // Instantiate UI

            // Game Collections
            this.projectiles = [];
            this.enemies = [];
            this.enemyProjectiles = [];
            this.particles = [];

            this.enemyTimer = 0;
            this.enemyInterval = 1500; 
        }

        update(deltaTime) {
            this.background.update();

            // Menu States
            if (this.gameState === 'home' || this.gameState === 'victory' || this.gameState === 'gameOver') {
                if (this.input.mouse.pressed) {
                    this.resetGame();
                    this.gameState = 'playing';
                    this.bgMusic.play().catch(err => console.log(err));
                    this.input.mouse.pressed = false;
                }
                return;
            }

            // UI Toggles
            if (this.input.keys.includes('Info')) {
                this.gameState = 'pausing';
                this.showInfo = !this.showInfo;
                this.input.keys = this.input.keys.filter(k => k !== 'Info');
            }

            if (this.showInfo) return;

            // Pause Logic
            if (this.input.keys.includes('Escape') && this.gameState === 'playing') {
                this.gameState = 'pausing';
                this.input.keys = [];
            }

            if (this.gameState === 'pausing') {
                this.handlePauseInput();
                return;
            }

            // Core Gameplay Logic
            if (this.gameState === 'playing') {
                this.updateActiveLevel(deltaTime);
            }
        }

        updateActiveLevel(deltaTime) { // 1. deltaTime starts here
            this.player.update(this.input, deltaTime);

            [this.particles, this.projectiles, this.enemyProjectiles].forEach(group => {
                group.forEach(obj => obj.update(deltaTime));
            });

            this.enemyTimer += deltaTime;
            if (this.enemyTimer > this.enemyInterval) {
                this.enemies.push(new Enemy(this));
                this.enemyTimer = 0;
            }

            // 2. Pass deltaTime into handleCollisions
            this.handleCollisions(deltaTime); 
            this.cleanupObjects();
        }

        handleCollisions(deltaTime) { // 3. Receive deltaTime here
            this.enemies.forEach(enemy => {
                // 4. FIX: Use deltaTime directly. 'this' is already the game.
                enemy.update(deltaTime); 
                
                if (this.checkCollision(this.player, enemy)) {
                    this.triggerGameOver();
                }

                this.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)) {
                        this.destroyEnemy(enemy, projectile);
                    }
                });
            });
        }

        handlePauseInput() {
            if (this.input.mouse.pressed) {
                const centerX = this.width / 2;
                if (this.input.mouse.x > centerX - 100 && this.input.mouse.x < centerX - 20) {
                    this.gameState = 'home';
                    this.bgMusic.pause();
                    this.bgMusic.currentTime = 0;
                } else if (this.input.mouse.x > centerX + 20 && this.input.mouse.x < centerX + 100) {
                    this.gameState = 'playing';
                }
                this.input.mouse.pressed = false;
            }
        }

        

        draw(context) {
            this.background.draw(context);
            if (this.gameState === 'playing' || this.gameState === 'pausing') {
                this.player.draw(context);
                this.projectiles.forEach(p => p.draw(context));
                this.enemies.forEach(e => e.draw(context));
                this.enemyProjectiles.forEach(ep => ep.draw(context));
                this.particles.forEach(p => p.draw(context));
            }
            this.ui.draw(context); // UI class handles all specific text/menu rendering
        }

        // Helper Methods
        checkCollision(rect1, rect2) {
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

        triggerGameOver() {
            this.gameState = 'gameOver';
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
        }

        destroyEnemy(enemy, projectile) {
            enemy.markedForDeletion = true;
            projectile.markedForDeletion = true;
            this.score++;
            for (let i = 0; i < 15; i++) {
                this.particles.push(new Particle(this, enemy.x + enemy.width / 2, enemy.y + enemy.height / 2));
            }
            if (this.score >= this.victoryCondition) {
                this.gameState = 'victory';
                this.bgMusic.pause();
            }
        }

        cleanupObjects() {
            this.particles = this.particles.filter(p => !p.markedForDeletion);
            this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
            this.enemies = this.enemies.filter(e => !e.markedForDeletion);
            this.enemyProjectiles = this.enemyProjectiles.filter(ep => !ep.markedForDeletion);
        }

        resetGame() {
            this.score = 0;
            this.lives = 5;
            this.showInfo = false;
            this.projectiles = [];
            this.enemies = [];
            this.enemyProjectiles = [];
            this.particles = [];
            this.enemyTimer = 0;
            this.player.x = this.width / 2 - this.player.renderWidth / 2;
            this.player.y = this.height / 2 - this.player.renderHeight / 2;
        }

        resize(newWidth, newHeight) {
            this.width = newWidth;
            this.height = newHeight;
        }
    }

    // Animation loop remains the same
    const game = new Game(canvas);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.resize(canvas.width, canvas.height);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

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