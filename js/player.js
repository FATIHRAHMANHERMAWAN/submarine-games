import { Idle, MovingUp, MovingDown, states } from './state.js';

export class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.image = document.getElementById('submarineSprite');
        
        // Sprite Dimensions (Adjust to your actual file)
        this.width = 128; 
        this.height = 128;
        
        this.x = gameWidth / 2 - this.width / 2;
        this.y = gameHeight / 2 - this.height / 2;
        this.frameX = 0;
        this.frameY = 0;
        
        this.speed = 0;
        this.maxSpeed = 4;

        // State Setup
        this.states = [
            new Idle(this), 
            new MovingUp(this), 
            new MovingDown(this)
        ];
        this.currentState = this.states[0];
        this.currentState.enter();
    }

    draw(context) {
        context.drawImage(this.image,
            this.frameX * this.width, this.frameY * this.height, this.width, this.height,
            this.x, this.y, this.width, this.height
        );
    }

    update(input) {
        this.currentState.handleInput(input);

        // Vertical Movement
        if (input.includes('ArrowUp')) this.y -= this.maxSpeed;
        if (input.includes('ArrowDown')) this.y += this.maxSpeed;
        
        // Horizontal Movement
        if (input.includes('ArrowLeft')) this.x -= this.maxSpeed;
        if (input.includes('ArrowRight')) this.x += this.maxSpeed;

        // Boundary Checks
        if (this.x < 0) this.x = 0;
        if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width;
        if (this.y < 0) this.y = 0;
        if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
    }

    setState(stateIndex) {
        this.currentState = this.states[stateIndex];
        this.currentState.enter();
    }
}