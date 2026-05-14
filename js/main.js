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
            this.lives = 5;
            this.showInfo = false;

            this.bgMusic = new Audio('src/backsound.mp3');
            this.bgMusic.loop = true;
            this.bgMusic.volume = 0.4; 

            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(canvasElement);

            this.projectiles = [];
            this.enemies = [];
            this.enemyProjectiles = [];
            this.particles = [];

            this.enemyTimer = 0;
            this.enemyInterval = 1500; 
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

        update(deltaTime) {
            this.background.update();

            // 1. MENU & STATIC STATE LOGIC
            if (this.gameState === 'home' || this.gameState === 'victory' || this.gameState === 'gameOver') {
                if (this.input.mouse.pressed) {
                    if (this.gameState === 'playing') return;
                    this.resetGame();
                    this.gameState = 'playing';
                    this.bgMusic.play().catch(err => console.log(err));
                    this.input.mouse.pressed = false;
                }
                return;
            }

            // 2. UI & PAUSE TOGGLES
            if (this.input.keys.includes('Info')) {
                this.showInfo = !this.showInfo;
                this.input.keys = this.input.keys.filter(k => k !== 'Info');
            }

            if (this.showInfo) return;

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
                    } else if (this.input.mouse.x > this.width / 2 + 20 && this.input.mouse.x < this.width / 2 + 100) {
                        this.gameState = 'playing';
                    }
                    this.input.mouse.pressed = false;
                }
                return;
            }

            // 3. ACTIVE GAMEPLAY LOGIC
            if (this.gameState === 'playing') {
                this.player.update(this.input, deltaTime);

                // Update visual effects and projectiles
                this.particles.forEach(p => p.update());
                this.particles = this.particles.filter(p => !p.markedForDeletion);

                this.projectiles.forEach(p => p.update());
                this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);

                // Enemy Spawning
                this.enemyTimer += deltaTime;
                if (this.enemyTimer > this.enemyInterval) {
                    this.enemies.push(new Enemy(this));
                    this.enemyTimer = 0;
                }

                // Enemy Logic & Collision
                this.enemies.forEach(enemy => {
                    enemy.update(deltaTime);

                    // NEW: Physical Collision (Player rams into Enemy)
                    if (this.checkCollision(this.player, enemy)) {
                        this.gameState = 'gameOver';
                        this.bgMusic.pause();
                        this.bgMusic.currentTime = 0;
                    }

                    // Torpedo vs Enemy Collision
                    this.projectiles.forEach(projectile => {
                        if (this.checkCollision(projectile, enemy)) {
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
                    });
                });
                this.enemies = this.enemies.filter(e => !e.markedForDeletion);

                // Enemy Bullet vs Player Collision
                this.enemyProjectiles.forEach(ep => {
                    ep.update();
                    if (this.checkCollision(ep, this.player)) {
                        ep.markedForDeletion = true;
                        this.lives--;
                        if (this.lives <= 0) {
                            this.gameState = 'gameOver';
                            this.bgMusic.pause();
                        }
                    }
                });
                this.enemyProjectiles = this.enemyProjectiles.filter(ep => !ep.markedForDeletion);
            }
        }

        draw(context) {
            this.background.draw(context);

            if (this.gameState === 'home') {
                this.drawMenu(context, 'SUBMARINE MODULAR GAME', 'Click to Deploy');
            } 
            
            else if (this.gameState === 'playing' || this.gameState === 'pausing') {
                this.player.draw(context);
                this.projectiles.forEach(p => p.draw(context));
                this.enemies.forEach(e => e.draw(context));
                this.enemyProjectiles.forEach(ep => ep.draw(context));
                this.particles.forEach(p => p.draw(context));

                this.drawStatus(context);

                if (this.gameState === 'pausing') this.drawPause(context);
                if (this.showInfo) this.drawInfo(context);
            } 
            
            else if (this.gameState === 'victory') {
                this.drawMenu(context, 'CONGRATULATIONS!', 'Mission Complete. Click to Restart');
            }

            else if (this.gameState === 'gameOver') {
                this.drawMenu(context, 'GAME OVER', 'Submarine Destroyed. Click to Retry', '#ff3333');
            }
        }

        drawStatus(context) {
            context.textAlign = 'left';
            context.font = 'bold 20px Courier New';
            context.fillStyle = '#ffcc00';
            context.fillText(`KILLS: ${this.score}/${this.victoryCondition}`, 30, 40);
            
            context.fillStyle = '#333';
            context.fillRect(30, 60, 150, 15);
            context.fillStyle = this.lives > 1 ? '#33ff33' : '#ff3333';
            context.fillRect(30, 60, (this.lives / 5) * 150, 15);
            context.strokeStyle = 'white';
            context.strokeRect(30, 60, 150, 15);
        }

        drawMenu(context, title, sub, color = '#00ffff') {
            context.fillStyle = 'rgba(0, 0, 0, 0.7)';
            context.fillRect(0, 0, this.width, this.height);
            context.textAlign = 'center';
            context.fillStyle = color;
            context.font = 'bold 48px Courier New';
            context.fillText(title, this.width / 2, this.height / 2 - 20);
            context.fillStyle = 'white';
            context.font = '20px Courier New';
            context.fillText(sub, this.width / 2, this.height / 2 + 40);
        }

        drawPause(context) {
            context.fillStyle = 'rgba(0, 0, 0, 0.7)';
            context.fillRect(0, 0, this.width, this.height);
            context.textAlign = 'center';
            context.fillStyle = 'white';
            context.font = '30px Courier New';
            context.fillText('QUIT TO HOME?', this.width / 2, this.height / 2 - 20);
            context.fillStyle = '#ff3333';
            context.fillText('YES', this.width / 2 - 60, this.height / 2 + 40);
            context.fillStyle = '#33ff33';
            context.fillText('NO', this.width / 2 + 60, this.height / 2 + 40);
        }

        drawInfo(context) {
            context.fillStyle = 'rgba(0, 0, 40, 0.9)';
            context.fillRect(this.width * 0.2, this.height * 0.2, this.width * 0.6, this.height * 0.6);
            context.strokeStyle = '#00ffff';
            context.strokeRect(this.width * 0.2, this.height * 0.2, this.width * 0.6, this.height * 0.6);
            
            context.textAlign = 'center';
            context.fillStyle = '#00ffff';
            context.font = 'bold 28px Courier New';
            context.fillText('CONTROLS', this.width / 2, this.height * 0.3);
            
            context.fillStyle = 'white';
            context.font = '18px Courier New';
            const lines = [
                'WASD / Arrows : Movement',
                'Mouse : Aim Direction',
                'F / Left Click : Shoot Torpedo',
                'ESC : Pause Menu',
                'I : Toggle this Info Tab'
            ];
            lines.forEach((line, i) => {
                context.fillText(line, this.width / 2, this.height * 0.4 + (i * 35));
            });
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