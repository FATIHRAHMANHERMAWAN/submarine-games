import { Idle, MovingUp, MovingDown, MovingHorizontal, states } from './state.js';
import { Projectile } from './projectile.js';

export class Player {
    constructor(game) {
        this.game = game;
        // 404 FIX: Ensure 'submarineSprite' matches the ID in your index.html exactly.
        this.image = document.getElementById('submarineSprite');
        
        // SPRITE SHEET MATH (spritites3_3.png is 677x369)
        // Using the exact mathematical floats avoids "drifting" pixels
        this.sw = 677 / 4; // 169.25
        this.sh = 369 / 2; // 184.5

        // Use a slightly larger height to avoid squashing the sprite visuals
        this.width = 60;  
        this.height = 45; 
        this.renderScale = 1.5; 
        this.renderWidth = this.width * this.renderScale;
        this.renderHeight = this.height * this.renderScale;

        this.x = this.game.width / 2 - this.renderWidth / 2;
        this.y = this.game.height / 2 - this.renderHeight / 2;
        
        this.frameX = 0; 
        this.frameY = 0; 

        this.vx = 0; 
        this.vy = 0; 
        this.acceleration = 0.5; 
        this.friction = 0.92; // Slightly more friction for a "liquid" feel

        this.maxSpeed = 6;
        this.facing = 'right'; 

        this.shootTimer = 0;
        this.shootCooldown = 200; 

        this.states = [
            new Idle(this),              
            new MovingUp(this),          
            new MovingDown(this),        
            new MovingHorizontal(this)   
        ];
        this.currentState = null;
        this.setState(states.IDLE);
    }

    shoot() {
        let spawnX = this.x + (this.facing === 'right' ? this.renderWidth : 0);
        const img = document.getElementById('playerProjectileSprite'); 
        this.game.projectiles.push(new Projectile(this.game, spawnX, this.y + this.renderHeight / 2, this.facing, img));
    }

    update(input, deltaTime) {
        if (!this.currentState) this.setState(states.IDLE);
        this.currentState.handleInput(input);

        // PHYSICS ENGINE
        if (input.keys.includes('ArrowUp')) this.vy -= this.acceleration;
        if (input.keys.includes('ArrowDown')) this.vy += this.acceleration;
        if (input.keys.includes('ArrowLeft')) this.vx -= this.acceleration;
        if (input.keys.includes('ArrowRight')) this.vx += this.acceleration;

        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;

        // ANIMATION MAPPING (Fixed for spritites3_3.png)
        if (this.vy < -2.0) {
            this.frameX = 2; this.frameY = 0; // HARD UP (Vertical)
        } else if (this.vy < -0.5) {
            this.frameX = 1; this.frameY = 0; // SLIGHT UP (Tilted)
        } else if (this.vy > 2.0) {
            this.frameX = 2; this.frameY = 1; // HARD DOWN (Vertical)
        } else if (this.vy > 0.5) {
            this.frameX = 3; this.frameY = 0; // SLIGHT DOWN (Tilted)
        } else {
            this.frameX = 0; this.frameY = 0; // NEUTRAL
        }

        // ORIENTATION LOGIC
        // We prioritize movement direction for facing to keep visuals intuitive
        if (this.vx > 0.2) this.facing = 'right';
        else if (this.vx < -0.2) this.facing = 'left';
        else {
            // If horizontal velocity is low, follow the mouse
            const playerCenterX = this.x + this.renderWidth / 2;
            if (Math.abs(input.mouse.x - playerCenterX) > 20) {
                this.facing = input.mouse.x < playerCenterX ? 'left' : 'right';
            }
        }

        // SHOOTING & BOUNDARIES
        if (this.shootTimer < this.shootCooldown) this.shootTimer += deltaTime;
        if ((input.keys.includes('Shoot') || input.mouse.pressed) && this.shootTimer >= this.shootCooldown) {
            this.shoot();
            this.shootTimer = 0;
        }

        if (this.x < 0) { this.x = 0; this.vx = 0; }
        if (this.x > this.game.width - this.renderWidth) { this.x = this.game.width - this.renderWidth; this.vx = 0; }
        if (this.y < 0) { this.y = 0; this.vy = 0; }
        if (this.y > this.game.height - this.renderHeight) { this.y = this.game.height - this.renderHeight; this.vy = 0; }
    }

    setState(stateIndex) {
        if (this.states[stateIndex]) {
            this.currentState = this.states[stateIndex];
            this.currentState.enter();
        }
    }

    draw(context) {
        if (!this.image.complete) return; 

        context.save();
        
        // UN-SMOOTHNESS FIX: 
        // Do NOT use Math.round on the translation. 
        // Allowing sub-pixel floats makes the motion look 100% continuous.
        context.translate(this.x + this.renderWidth / 2, this.y + this.renderHeight / 2);

        if (this.facing === 'left') {
            context.scale(-1, 1);
        }

        // DRAWING CALL
        context.drawImage(
            this.image,
            this.frameX * this.sw, this.frameY * this.sh, // Exact source clipping
            this.sw, this.sh, 
            -this.renderWidth / 2, -this.renderHeight / 2,
            this.renderWidth, this.renderHeight
        );

        context.restore();
    }
}