// js/player.js
import { Idle, MovingUp, MovingDown, states } from './state.js';

export class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.image = document.getElementById('submarineSprite');
        
        // 1. Set basic properties
        this.width = 103; 
        this.height = 102;
        this.x = gameWidth / 2 - this.width / 2;
        this.y = gameHeight / 2 - this.height / 2;
        this.frameX = 0;
        this.frameY = 0;
        this.maxSpeed = 4;

        // 2. DEFINE THE ARRAY FIRST (This was likely missing or lower down)
        this.states = [
            new Idle(this),       // Index 0
            new MovingUp(this),   // Index 1
            new MovingDown(this)  // Index 2
        ];
        
        // 3. NOW it is safe to set the initial state
        this.currentState = null; // Start empty
        this.setState(states.IDLE); 
    }

    update(input) {
        // Defensive check: If for some reason currentState is null, rescue it
        if (!this.currentState) {
            this.setState(states.IDLE);
            return;
        }

        this.currentState.handleInput(input);

        // Movement logic...
        if (input.includes('ArrowUp')) this.y -= this.maxSpeed;
        if (input.includes('ArrowDown')) this.y += this.maxSpeed;
        if (input.includes('ArrowLeft')) this.x -= this.maxSpeed;
        if (input.includes('ArrowRight')) this.x += this.maxSpeed;

        // Boundary checks...
        if (this.x < 0) this.x = 0;
        if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
    }

    setState(stateIndex) {
        // Check if this.states exists AND the specific index exists
        if (this.states && this.states[stateIndex]) {
            this.currentState = this.states[stateIndex];
            this.currentState.enter();
        } else {
            console.error("Failed to set state. Check if this.states is initialized.");
        }
    }

    draw(context) {
        context.drawImage(this.image,
            this.frameX * this.width, this.frameY * this.height, this.width, this.height,
            this.x, this.y, this.width, this.height
        );
    }
}