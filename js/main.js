import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { Enemy } from './enemy.js';
import { Particle } from './particle.js';

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

            this.bgMusic = new Audio('src/backsound.mp3');
            this.bgMusic.loop = true;
            this.bgMusic.volume = 0.4; 

            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(canvasElement);

            this.projectiles = [];
            this.enemies = [];
            this.enemyProjectiles = [];
            this.particles = []; // Particle array initialized

            this.enemyTimer = 0;
            this.enemyInterval = 1500; 
        }

        resetGame() {
            this.score = 0;
            this.projectiles = [];
            this.enemies = [];
            this.enemyProjectiles = [];
            this.particles = []; // Reset particles on new game
            this.enemyTimer = 0;
            this.player.x = this.width / 2 - this.player.renderWidth / 2;
            this.player.y = this.height / 2 - this.player.renderHeight / 2;
        }

        resize(newWidth, newHeight) {
            this.width = newWidth;
            this.height = newHeight;
        }

        update(deltaTime) {
            this.background.update();

            if (this.gameState === 'home') {
                if (this.input.mouse.pressed) {
                    this.resetGame();
                    this.gameState = 'playing';
                    this.bgMusic.play().catch(err => console.log("Audio play blocked: ", err));
                    this.input.mouse.pressed = false;
                }
                return;
            }

            if (this.gameState === 'victory') {
                if (this.input.mouse.pressed) {
                    this.gameState = 'home';
                    this.input.mouse.pressed = false;
                }
                return;
            }

            if (this.input.keys.includes('Escape') && this.gameState === 'playing') {
                this.gameState = 'pausing';
                this.input.keys = [];
            }

            if (this.gameState === 'pausing') {
                if (this.input.mouse.pressed) {
                    if (this.input.mouse.x > this.width / 2 - 100 && this.input.mouse.x < this.width / 2 - 20) {
                        this.gameState = 'home';
                        this.bgMusic.pause();
                        this.bgMusic.currentTime = 0;
                    } 
                    else if (this.input.mouse.x > this.width / 2 + 20 && this.input.mouse.x < this.width / 2 + 100) {
                        this.gameState = 'playing';
                    }
                    this.input.mouse.pressed = false;
                }
                return;
            }

            if (this.gameState === 'playing') {
                this.player.update(this.input, deltaTime);

                // Update and Filter Particles
                this.particles.forEach(particle => particle.update());
                this.particles = this.particles.filter(p => !p.markedForDeletion);

                this.projectiles.forEach(p => p.update());
                this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);

                this.enemyTimer += deltaTime;
                if (this.enemyTimer > this.enemyInterval) {
                    this.enemies.push(new Enemy(this));
                    this.enemyTimer = 0;
                }

                this.enemies.forEach(enemy => {
                    enemy.update(deltaTime);
                    
                    this.projectiles.forEach(projectile => {
                        if (this.checkCollision(projectile, enemy)) {
                            enemy.markedForDeletion = true;
                            projectile.markedForDeletion = true;
                            this.score++;

                            // SPAWN PARTICLES ON HIT
                            for (let i = 0; i < 15; i++) {
                                this.particles.push(new Particle(
                                    this, 
                                    enemy.x + enemy.width / 2, 
                                    enemy.y + enemy.height / 2
                                ));
                            }

                            if (this.score >= this.victoryCondition) {
                                this.gameState = 'victory';
                                this.bgMusic.pause();
                                this.bgMusic.currentTime = 0;
                            }
                        }
                    });
                });
                this.enemies = this.enemies.filter(e => !e.markedForDeletion);

                this.enemyProjectiles.forEach(ep => {
                    ep.update();
                    if (this.checkCollision(ep, this.player)) {
                        ep.markedForDeletion = true;
                    }
                });
                this.enemyProjectiles = this.enemyProjectiles.filter(ep => !ep.markedForDeletion);
            }
        }

        draw(context) {
            this.background.draw(context);

            if (this.gameState === 'home') {
                context.fillStyle = 'rgba(0, 0, 0, 0.6)';
                context.fillRect(0, 0, this.width, this.height);

                context.textAlign = 'center';
                context.fillStyle = '#00ffff';
                context.font = 'bold 48px Courier New';
                context.fillText('SUBMARINE MODULAR GAME', this.width / 2, this.height / 2 - 40);

                context.fillStyle = '#ffffff';
                context.font = '24px Courier New';
                context.fillText('Click Anywhere to Deploy Submarine', this.width / 2, this.height / 2 + 30);
            } 
            
            else if (this.gameState === 'playing' || this.gameState === 'pausing') {
                this.player.draw(context);
                this.projectiles.forEach(p => p.draw(context));
                this.enemies.forEach(e => e.draw(context));
                this.enemyProjectiles.forEach(ep => ep.draw(context));
                this.particles.forEach(p => p.draw(context)); // Draw Particles

                context.textAlign = 'left';
                context.fillStyle = '#ffcc00';
                context.font = 'bold 24px Courier New';
                context.fillText(`KILLS: ${this.score} / ${this.victoryCondition}`, 30, 40);

                if (this.gameState === 'pausing') {
                    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
                    context.fillRect(0, 0, this.width, this.height);

                    context.textAlign = 'center';
                    context.fillStyle = '#ffffff';
                    context.font = '32px Courier New';
                    context.fillText('QUIT TO HOME PAGE?', this.width / 2, this.height / 2 - 20);

                    context.font = 'bold 28px Courier New';
                    context.fillStyle = '#ff3333'; 
                    context.fillText('YES', this.width / 2 - 60, this.height / 2 + 40);
                    
                    context.fillStyle = '#33ff33'; 
                    context.fillText('NO', this.width / 2 + 60, this.height / 2 + 40);
                }
            } 
            
            else if (this.gameState === 'victory') {
                context.fillStyle = 'rgba(0, 15, 10, 0.85)';
                context.fillRect(0, 0, this.width, this.height);

                context.textAlign = 'center';
                context.fillStyle = '#33ff33';
                context.font = 'bold 64px Courier New';
                context.fillText('CONGRATULATIONS!', this.width / 2, this.height / 2 - 40);

                context.fillStyle = '#ffffff';
                context.font = '24px Courier New';
                context.fillText('Mission Complete! Hit 5 Targets.', this.width / 2, this.height / 2 + 20);
                context.fillStyle = '#888888';
                context.fillText('Click anywhere to return Home', this.width / 2, this.height / 2 + 80);
            }
        }

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
    }

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