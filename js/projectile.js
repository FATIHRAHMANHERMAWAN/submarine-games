export class Projectile {
    constructor(game, x, y, direction) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 6;
        this.speed = 12;
        this.direction = direction;
        this.markedForDeletion = false;
    }
    update() {
        if (this.direction === 'right') this.x += this.speed;
        else this.x -= this.speed;

        // Automatically delete if it exits the viewport boundaries
        if (this.x > this.game.width || this.x < -this.width) {
            this.markedForDeletion = true;
        }
    }
    draw(context) {
        context.fillStyle = '#ffcc00'; // Bright neon torpedo yellow
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}

export class EnemyProjectile extends Projectile {
    constructor(game, x, y) {
        super(game, x, y, 'left');
        this.speed = 6;
        this.width = 10;
        this.height = 10;
    }
    draw(context) {
        context.fillStyle = '#ff3333'; // Crimson enemy plasma red
        context.beginPath();
        context.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
        context.fill();
    }
}