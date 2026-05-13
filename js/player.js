import { Idle, MovingUp, MovingDown, MovingHorizontal, states } from './state.js';
import { Projectile } from './projectile.js';

export class Player {
    constructor(game) {
        this.game = game;
        this.gameWidth = game.width;
        this.gameHeight = game.height;
        this.image = document.getElementById('submarineSprite');
        
        this.width = 56;  
        this.height = 57;
        this.renderScale = 1.0; 
        this.renderWidth = this.width * this.renderScale;
        this.renderHeight = this.height * this.renderScale;

        this.x = this.gameWidth / 2 - this.renderWidth / 2;
        this.y = this.gameHeight / 2 - this.renderHeight / 2;
        
        this.frameX = 0; 
        this.frameY = 0; 
        this.maxSpeed = 6;
        this.facing = 'right'; 

        // Fire rate limits
        this.shootTimer = 0;
        this.shootCooldown = 200; // 5 shots per second max execution speed

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
        let spawnX = this.x + this.renderWidth;
        if (this.facing === 'left') spawnX = this.x;
        
        this.game.projectiles.push(new Projectile(this.game, spawnX, this.y + this.renderHeight / 2, this.facing));
    }

    update(input, deltaTime) {
        if (!this.currentState) this.setState(states.IDLE);
        this.currentState.handleInput(input);

        // Target orientation following cursor position
        const playerCenterX = this.x + this.renderWidth / 2;
        this.facing = input.mouse.x < playerCenterX ? 'left' : 'right';

        // Keyboard tracking engines
        if (input.keys.includes('ArrowUp')) this.y -= this.maxSpeed;
        if (input.keys.includes('ArrowDown')) this.y += this.maxSpeed;
        if (input.keys.includes('ArrowLeft')) this.x -= this.maxSpeed;
        if (input.keys.includes('ArrowRight')) this.x += this.maxSpeed;

        // Cooldown processing loops
        if (this.shootTimer < this.shootCooldown) this.shootTimer += deltaTime;
        if ((input.keys.includes('Shoot') || input.mouse.pressed) && this.shootTimer >= this.shootCooldown) {
            this.shoot();
            this.shootTimer = 0;
        }

        // Screen boundary locks
        if (this.x < 0) this.x = 0;
        if (this.x > this.game.gameWidth - this.renderWidth) this.x = this.game.gameWidth - this.renderWidth;
        if (this.y < 0) this.y = 0;
        if (this.y > this.game.gameHeight - this.renderHeight) this.y = this.game.gameHeight - this.renderHeight;
    }

    setState(stateIndex) {
        if (this.states[stateIndex]) {
            this.currentState = this.states[stateIndex];
            this.currentState.enter();
        }
    }

    draw(context) {
        context.save();
        let shouldFlip = this.facing === 'left';
        if (this.frameY === 4) shouldFlip = this.facing === 'right';

        if (shouldFlip) {
            context.translate(this.x + this.renderWidth / 2, this.y + this.renderHeight / 2);
            context.scale(-1, 1);
            context.drawImage(this.image,
                this.frameX * this.width, this.frameY * this.height, this.width, this.height,
                -this.renderWidth / 2, -this.renderHeight / 2, this.renderWidth, this.renderHeight
            );
        } else {
            context.drawImage(this.image,
                this.frameX * this.width, this.frameY * this.height, this.width, this.height,
                this.x, this.y, this.renderWidth, this.renderHeight
            );
        }
        context.restore(); 
    }
}