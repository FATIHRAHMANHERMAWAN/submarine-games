// js/player.js
import { Idle, MovingUp, MovingDown, MovingHorizontal, states } from './state.js';

export class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.image = document.getElementById('submarineSprite');
        
        // Exact frame dimensions based on your 453x550 sheet
        this.width = 56;  
        this.height = 55;
        
        // Render size multiplier (makes the 56x55 crop look bigger on screen)
        this.renderScale = 1.0; 
        this.renderWidth = this.width * this.renderScale;
        this.renderHeight = this.height * this.renderScale;

        this.x = gameWidth / 2 - this.renderWidth / 2;
        this.y = gameHeight / 2 - this.renderHeight / 2;


        // this.width = 56;  
        // this.height = 55; 

        // this.x = gameWidth / 2 - this.width / 2;
        // this.y = gameHeight / 2 - this.height / 2;
        
        this.frameX = 0; // Stays locked at the first column frame now
        this.frameY = 0; // Governed by states
        this.maxSpeed = 5;
        this.facing = 'right'; // Tracks horizontal orientation: 'right' or 'left'

        // Initialize FSM Array
        this.states = [
            new Idle(this),              // 0
            new MovingUp(this),          // 1
            new MovingDown(this),        // 2
            new MovingHorizontal(this)   // 3
        ];
        this.currentState = null;
        this.setState(states.IDLE);
    }

    update(input) {
        if (!this.currentState) this.setState(states.IDLE);
        this.currentState.handleInput(input);

        // 8-Directional Position Modifications
        if (input.includes('ArrowUp')) this.y -= this.maxSpeed;
        if (input.includes('ArrowDown')) this.y += this.maxSpeed;
        if (input.includes('ArrowLeft')) this.x -= this.maxSpeed;
        if (input.includes('ArrowRight')) this.x += this.maxSpeed;

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

        if (this.facing === 'left') {
            // Move canvas coordinate matrix pivot point to the center of the player box
            context.translate(this.x + this.renderWidth / 2, this.y + this.renderHeight / 2);
            // Flip horizontal axis
            context.scale(-1, 1);
            // Draw relative to flipped focal center
            context.drawImage(this.image,
                this.frameX * this.width, this.frameY * this.height, this.width, this.height,
                -this.renderWidth / 2, -this.renderHeight / 2, this.renderWidth, this.renderHeight
            );
        } else {
            // Standard right drawing sequence
            context.drawImage(this.image,
                this.frameX * this.width, this.frameY * this.height, this.width, this.height,
                this.x, this.y, this.renderWidth, this.renderHeight
            );
        }

        context.restore(); // Undo scale transformations for subsequent draws
    }
}