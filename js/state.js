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
        this.player.frameY = 0; // Standard row
    }
    handleInput(input) {
        if (input.includes('ArrowLeft') || input.includes('ArrowRight')) {
            this.player.setState(states.MOVING_HORIZONTAL);
        } else if (input.includes('ArrowUp')) {
            this.player.setState(states.MOVING_UP);
        } else if (input.includes('ArrowDown')) {
            this.player.setState(states.MOVING_DOWN);
        }
    }
}

export class MovingHorizontal extends State {
    constructor(player) {
        super(states.MOVING_HORIZONTAL);
        this.player = player;
    }
    enter() {
        this.player.frameY = 0; // Propeller spinning row
    }
    handleInput(input) {
        if (input.includes('ArrowLeft')) this.player.facing = 'left';
        if (input.includes('ArrowRight')) this.player.facing = 'right';

        if (input.includes('ArrowUp')) this.player.setState(states.MOVING_UP);
        else if (input.includes('ArrowDown')) this.player.setState(states.MOVING_DOWN);
        else if (input.length === 0) this.player.setState(states.IDLE);
    }
}

export class MovingUp extends State {
    constructor(player) {
        super(states.MOVING_UP);
        this.player = player;
    }
    enter() {
        this.player.frameY = 6; // Row with massive vertical bubbles
    }
    handleInput(input) {
        if (input.includes('ArrowLeft')) this.player.facing = 'left';
        if (input.includes('ArrowRight')) this.player.facing = 'right';

        if (!input.includes('ArrowUp')) {
            if (input.includes('ArrowDown')) this.player.setState(states.MOVING_DOWN);
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
        this.player.frameY = 4; // Row with diving current lines
    }
    handleInput(input) {
        if (input.includes('ArrowLeft')) this.player.facing = 'left';
        if (input.includes('ArrowRight')) this.player.facing = 'right';

        if (!input.includes('ArrowDown')) {
            if (input.includes('ArrowUp')) this.player.setState(states.MOVING_UP);
            else this.player.setState(states.IDLE);
        }
    }
}