// js/state.js
export const states = {
    IDLE: 0,
    MOVING_UP: 1,
    MOVING_DOWN: 2,
    MOVING_HORIZONTAL: 3
};

class State {
    constructor(state) {
        this.state = state;
    }
}

export class Idle extends State {
    constructor(player) {
        super(states.IDLE);
        this.player = player;
    }
    enter() {
        this.player.frameY = 0; // Clean, standard row
    }
    handleInput(input) {
        // Always monitor horizontal orientation changes
        if (input.includes('ArrowLeft')) this.player.facing = 'left';
        if (input.includes('ArrowRight')) this.player.facing = 'right';

        if (input.includes('ArrowUp')) {
            this.player.setState(states.MOVING_UP);
        } else if (input.includes('ArrowDown')) {
            this.player.setState(states.MOVING_DOWN);
        } else if (input.includes('ArrowLeft') || input.includes('ArrowRight')) {
            this.player.setState(states.MOVING_HORIZONTAL);
        }
    }
}

export class MovingHorizontal extends State {
    constructor(player) {
        super(states.MOVING_HORIZONTAL);
        this.player = player;
    }
    enter() {
        this.player.frameY = 0; // Horizontal movement row
    }
    handleInput(input) {
        if (input.includes('ArrowLeft')) this.player.facing = 'left';
        if (input.includes('ArrowRight')) this.player.facing = 'right';

        if (input.includes('ArrowUp')) this.player.setState(states.MOVING_UP);
        else if (input.includes('ArrowDown')) this.player.setState(states.MOVING_DOWN);
        else if (!input.includes('ArrowLeft') && !input.includes('ArrowRight')) {
            this.player.setState(states.IDLE);
        }
    }
}

export class MovingUp extends State {
    constructor(player) {
        super(states.MOVING_UP);
        this.player = player;
    }
    enter() {
        // Shifted from 6 to 5 to accurately target the sub hull with ascending bubbles beneath it
        this.player.frameY = 5; 
    }
    handleInput(input) {
        if (input.includes('ArrowLeft')) this.player.facing = 'left';
        if (input.includes('ArrowRight')) this.player.facing = 'right';

        if (!input.includes('ArrowUp')) {
            if (input.includes('ArrowDown')) this.player.setState(states.MOVING_DOWN);
            else if (input.includes('ArrowLeft') || input.includes('ArrowRight')) this.player.setState(states.MOVING_HORIZONTAL);
            else this.player.setState(states.IDLE);
        }
    }
}

export class MovingDown extends State {
    constructor(player) {
        super(states.MOVING_DOWN);
        this.player = player;
    }
    enter() {
        this.player.frameY = 4; // Targets the row with water current/diving lines
    }
    handleInput(input) {
        if (input.includes('ArrowLeft')) this.player.facing = 'left';
        if (input.includes('ArrowRight')) this.player.facing = 'right';

        if (!input.includes('ArrowDown')) {
            if (input.includes('ArrowUp')) this.player.setState(states.MOVING_UP);
            else if (input.includes('ArrowLeft') || input.includes('ArrowRight')) this.player.setState(states.MOVING_HORIZONTAL);
            else this.player.setState(states.IDLE);
        }
    }
}