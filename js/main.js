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
            
            // Core States: 'home', 'playing', 'pausing', 'victory'
            this.gameState = 'home';
            this.score = 0;
            this.victoryCondition = 5;

            // Audio Asset Setup (Ensure a music file exists at this path!)
            this.bgMusic = new Audio('src/backsound.mp3');
            this.bgMusic.loop = true;
            this.bgMusic.volume = 0.4; // 40% volume mix

            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(canvasElement);

            this.projectiles = [];
            this.enemies = [];
            this.enemyProjectiles = [];

            this.enemyTimer = 0;
            this.enemyInterval = 1500; 
        }

        // Resets entities and positions for fresh playthroughs
        resetGame() {
            this.score = 0;
            this.projectiles = [];
            this.enemies = [];
            this.enemyProjectiles = [];
            this.enemyTimer = 0;
            this.player.x = this.width / 2 - this.player.renderWidth / 2;
            this.player.y = this.height / 2 - this.player.renderHeight / 2;
        }

        resize(newWidth, newHeight) {
            this.width = newWidth;
            this.height = newHeight;
        }

        update(deltaTime) {
            // Update background elements uniformly across all menus
            this.background.update();

            // MENU SCREEN LOGIC
            if (this.gameState === 'home') {
                if (this.input.mouse.pressed) {
                    this.resetGame();
                    this.gameState = 'playing';
                    this.bgMusic.play().catch(err => console.log("Audio play blocked: ", err));
                    this.input.mouse.pressed = false; // Reset toggle
                }
                return;
            }

            if (this.gameState === 'victory') {
                if (this.input.mouse.pressed) {
                    this.gameState = 'home';
                    this.input.mouse.pressed = false; // Reset toggle
                }
                return;
            }

            // ESCAPE KEY DETECTION (Triggers Pause)
            if (this.input.keys.includes('Escape') && this.gameState === 'playing') {
                this.gameState = 'pausing';
                this.input.keys = []; // Clear key array to prevent rapid toggling back and forth
            }

            // PAUSE MENU LOGIC
            if (this.gameState === 'pausing') {
                if (this.input.mouse.pressed) {
                    // Check if user clicked the "YES" side (Quit)
                    if (this.input.mouse.x > this.width / 2 - 100 && this.input.mouse.x < this.width / 2 - 20) {
                        this.gameState = 'home';
                        this.bgMusic.pause();
                        this.bgMusic.currentTime = 0; // Rewind audio
                    } 
                    // Check if user clicked the "NO" side (Resume)
                    else if (this.input.mouse.x > this.width / 2 + 20 && this.input.mouse.x < this.width / 2 + 100) {
                        this.gameState = 'playing';
                    }
                    this.input.mouse.pressed = false; // Reset mouse click
                }
                return; // Stop updating game objects while paused
            }

            // ACTIVE GAMEPLAY LOGIC RUNTIME
            if (this.gameState === 'playing') {
                this.player.update(this.input, deltaTime);

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

                            // VICTORY EVALUATION ENGINE
                            if (this.score >= this.victoryCondition) {
                                this.gameState = 'victory';
                                this.bgMusic.pause();
                                this.bgMusic.currentTime = 0; // Rewind track back to the start
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

            // RENDER LOGIC OVERLAYS BASED ON GAME STATE
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

                // Live Core Score HUD UI
                context.textAlign = 'left';
                context.fillStyle = '#ffcc00';
                context.font = 'bold 24px Courier New';
                context.fillText(`KILLS: ${this.score} / ${this.victoryCondition}`, 30, 40);

                // PAUSE MENU OVERLAY
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