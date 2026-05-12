export const states = {
    IDLE: 0,
    MOVING_UP: 1,
    MOVING_DOWN: 2,
    MOVING_SIDE: 3
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
        if (input.includes('ArrowUp')) this.player.setState(states.MOVING_UP);
        else if (input.includes('ArrowDown')) this.player.setState(states.MOVING_DOWN);
    }
}

export class MovingUp extends State {
    constructor(player) {
        super(states.MOVING_UP);
        this.player = player;
    }
    enter() {
        this.player.frameY = 5; // Row with bubbles beneath
    }
    handleInput(input) {
        if (!input.includes('ArrowUp')) this.player.setState(states.IDLE);
    }
}

export class MovingDown extends State {
    constructor(player) {
        super(states.MOVING_DOWN);
        this.player = player;
    }
    enter() {
        this.player.frameY = 4; // Row with current/waves entering
    }
    handleInput(input) {
        if (!input.includes('ArrowDown')) this.player.setState(states.IDLE);
    }
}