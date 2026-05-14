export class Projectile {
    constructor(game, x, y, direction, image) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.image = image; // The sprite image
        this.width = 32;    // Adjusted for sprite size
        this.height = 16;
        this.speed = 12;
        this.direction = direction;
        this.markedForDeletion = false;
    }
    update() {
        if (this.direction === 'right') this.x += this.speed;
        else this.x -= this.speed;

        if (this.x > this.game.width || this.x < -this.width) {
            this.markedForDeletion = true;
        }
    }
    draw(context) {
        context.save();
        context.translate(this.x + this.width / 2, this.y + this.height / 2);
        
        // Flip the sprite if moving left
        if (this.direction === 'left') {
            context.scale(-1, 1);
        }
        
        // Draw the image centered
        if (this.image) {
            context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            // Fallback if image isn't loaded
            context.fillStyle = '#ffcc00';
            context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }
        context.restore();
    }
}

export class EnemyProjectile extends Projectile {
    constructor(game, x, y, image) {
        super(game, x, y, 'left', image);
        this.speed = 6;
        this.width = 20;
        this.height = 20;
    }
    // Draws the enemy projectile (e.g., a dark torpedo or mine)
}