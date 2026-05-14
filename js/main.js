import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { UI } from './UI.js';
import { SoundHandler } from './SoundHandler.js';
import { EntityManager } from './EntityManager.js';

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
            this.lives = 5;
            this.victoryCondition = 5;
            this.showInfo = false;

            //for paralax
            this.showinfocondition = false;

            // System Modules
            this.sounds = new SoundHandler();
            this.entities = new EntityManager(this);
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(canvasElement);
            this.ui = new UI(this);
        }

        update(deltaTime) {
            this.background.update();

            // --- 1. GLOBAL PAUSE TOGGLE ---
            // Moving this here ensures it works regardless of the gameState
            if (this.input.keys.includes('Escape')) {
                if (this.gameState === 'playing') {
                    this.gameState = 'pausing';
                } else if (this.gameState === 'pausing') {
                    this.gameState = 'playing';
                }
                // Clear the key so it doesn't flicker between states
                this.input.keys = this.input.keys.filter(k => k !== 'Escape');
            }

            // --- 2. MENU BLOCK ---
            if (this.gameState !== 'playing') {
                this.handleMenuStates();
                return; // Physics below will only run if we are 'playing'
            }

            // --- 3. ACTIVE GAMEPLAY ---
            if (!this.showInfo) {
                this.player.update(this.input, deltaTime);
                this.entities.update(deltaTime);
                this.handleCollisions(deltaTime);
            }

            // Toggle Info (I key)
            if (this.input.keys.includes('Info')) {
                this.showinfocondition = !this.showinfocondition;
                this.showInfo = !this.showInfo;
                // this.gameState = 'pausing'
                this.input.keys = this.input.keys.filter(k => k !== 'Info');
            }
        }

                // THIS IS THE FUNCTION YOU ASKED ABOUT - ADD THIS:
        updateActiveLevel(deltaTime) {
            this.player.update(this.input, deltaTime);
            this.entities.update(deltaTime); // This moves enemies and bullets
            this.handleCollisions(deltaTime); // This checks if hearts should drop
        }

        handleMenuStates() {
            if (this.input.mouse.pressed) {
                if (this.gameState === 'home' || this.gameState === 'victory' || this.gameState === 'gameOver') {
                    this.resetGame();
                    this.gameState = 'playing';
                    this.sounds.playMusic();
                } else if (this.gameState === 'pausing') {
                    this.handlePauseInput();
                }
                this.input.mouse.pressed = false;
            }
        }

        handlePauseInput() {
            const centerX = this.width / 2;
            if (this.input.mouse.x > centerX - 100 && this.input.mouse.x < centerX - 20) {
                this.gameState = 'home';
                this.sounds.resetMusic();
            } else if (this.input.mouse.x > centerX + 20 && this.input.mouse.x < centerX + 100) {
                this.gameState = 'playing';
            }
        }

                // Inside class Game in main.js
                // Add this inside the Game class in main.js, 
        // usually right before or after handleCollisions()

        // Add this inside the Game class in main.js

        destroyEnemy(enemy, projectile) {
            enemy.markedForDeletion = true;
            projectile.markedForDeletion = true;
            this.score++;

            // Spawning particles through the new modular path
            for (let i = 0; i < 15; i++) {
                this.entities.particles.push(
                    new Particle(
                        this, 
                        enemy.x + enemy.width / 2, 
                        enemy.y + enemy.height / 2
                    )
                );
            }

            // Check if player reached the kill goal
            if (this.score >= this.victoryCondition) {
                this.gameState = 'victory';
                this.sounds.pauseMusic();
            }
        }

        triggerGameOver() {
            this.gameState = 'gameOver';
            this.sounds.resetMusic(); // This stops the backsound when you lose
        }


        handleCollisions(deltaTime) {
            // Enemy vs Player Torpedo
            this.entities.enemies.forEach(enemy => {
                // Submarine-to-Submarine crash
                if (this.checkCollision(this.player, enemy)) {
                    this.triggerGameOver(); 
                }

                this.entities.projectiles.forEach(projectile => {
                    if (this.checkCollision(projectile, enemy)) {
                        this.destroyEnemy(enemy, projectile); // This is the function we just added!
                    }
                });
            });

            // Enemy Torpedo vs Player Submarine
            this.entities.enemyProjectiles.forEach(ep => {
                if (this.checkCollision(ep, this.player)) {
                    ep.markedForDeletion = true;
                    this.lives--;
                    console.log("Player hit! Lives remaining: " + this.lives);

                    if (this.lives <= 0) {
                        this.triggerGameOver();
                    }
                }
            });
        }

        draw(context) {
            this.background.draw(context);
            if (this.gameState === 'playing' || this.gameState === 'pausing') {
                this.player.draw(context);
                this.entities.draw(context);
            }
            this.ui.draw(context);
        }

        checkCollision(r1, r2) {
            const w1 = r1.renderWidth || r1.width;
            const h1 = r1.renderHeight || r1.height;
            const w2 = r2.renderWidth || r2.width;
            const h2 = r2.renderHeight || r2.height;
            return (r1.x < r2.x + w2 && r1.x + w1 > r2.x && r1.y < r2.y + h2 && r1.y + h1 > r2.y);
        }

        resetGame() {
            this.score = 0;
            this.lives = 5;
            this.entities.clear();
            this.player.x = this.width / 2 - this.player.renderWidth / 2;
            this.player.y = this.height / 2 - this.player.renderHeight / 2;
        }

                // Inside class Game in main.js
        resize(newWidth, newHeight) {
            this.width = newWidth;
            this.height = newHeight;
            
            // Optional: Tell other modules to resize if they have their own dimensions
            if (this.player) {
                // You might want to reposition the player or update boundaries here
            }
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