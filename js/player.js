// js/player.js
import { Idle, MovingUp, MovingDown, MovingHorizontal, states } from './state.js';

export class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.image = document.getElementById('submarineSprite');
        
        // Extracted grid measurements for your 453x550 sheet
        this.width = 56;  
        this.height = 57;
        
        // Upscale factor for laptop gameplay clarity
        this.renderScale = 1.0; 
        this.renderWidth = this.width * this.renderScale;
        this.renderHeight = this.height * this.renderScale;

        this.x = gameWidth / 2 - this.renderWidth / 2;
        this.y = gameHeight / 2 - this.renderHeight / 2;
        
        this.frameX = 0; // Base frame column
        this.frameY = 0; // State row matrix marker
        this.maxSpeed = 5;
        this.facing = 'right'; 

        this.states = [
            new Idle(this),              
            new MovingUp(this),          
            new MovingDown(this),        
            new MovingHorizontal(this)   
        ];
        this.currentState = null;
        this.setState(states.IDLE);
    }

    // Inside js/player.js
    update(input) {
        if (!this.currentState) this.setState(states.IDLE);
        this.currentState.handleInput(input);

        // MOUSE AIM ENGINE
        const playerCenterX = this.x + this.renderWidth / 2;
        if (input.mouse.x < playerCenterX) {
            this.facing = 'left';
        } else {
            this.facing = 'right';
        }

        // KEYBOARD MOVEMENT ENGINE (Updated to use input.keys.includes)
        if (input.keys.includes('ArrowUp')) this.y -= this.maxSpeed;
        if (input.keys.includes('ArrowDown')) this.y += this.maxSpeed;
        if (input.keys.includes('ArrowLeft')) this.x -= this.maxSpeed;
        if (input.keys.includes('ArrowRight')) this.x += this.maxSpeed;

        // Window Boundaries
        if (this.x < 0) this.x = 0;
        if (this.x > this.gameWidth - this.renderWidth) this.x = this.gameWidth - this.renderWidth;
        if (this.y < 0) this.y = 0;
        if (this.y > this.gameHeight - this.renderHeight) this.y = this.gameHeight - this.renderHeight;
    }

    setState(stateIndex) {
        if (this.states[stateIndex]) {
            this.currentState = this.states[stateIndex];
            this.currentState.enter();
        }
    }

    draw(context) {
        context.save();

        // Determine if the sprite needs to be horizontally mirrored.
        let shouldFlip = this.facing === 'left';
        
        // SWAP LOGIC: If we are on row 4 (descend), invert the flipping rule
        // because the base sprite asset is already facing left.
        if (this.frameY === 4) {
            shouldFlip = this.facing === 'right';
        }

        if (shouldFlip) {
            // Move canvas coordinate matrix pivot point to the center of the player box
            context.translate(this.x + this.renderWidth / 2, this.y + this.renderHeight / 2);
            // Flip horizontal axis
            context.scale(-1, 1);
            context.drawImage(this.image,
                this.frameX * this.width, this.frameY * this.height, this.width, this.height,
                -this.renderWidth / 2, -this.renderHeight / 2, this.renderWidth, this.renderHeight
            );
        } else {
            // Standard drawing sequence
            context.drawImage(this.image,
                this.frameX * this.width, this.frameY * this.height, this.width, this.height,
                this.x, this.y, this.renderWidth, this.renderHeight
            );
        }

        context.restore(); 
    }
}