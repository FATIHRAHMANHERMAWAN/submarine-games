export class Projectile {
    constructor(game, x, y, direction, image) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.image = image; 
        this.width = 32;    
        this.height = 16;
        this.speed = 12;
        this.direction = direction;
        this.markedForDeletion = false;
    }

    update() {
        if (this.direction === 'right') this.x += this.speed;
        else this.x -= this.speed;

        // Cleanup when off-screen
        if (this.x > this.game.width || this.x < -this.width) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        context.save();
        context.translate(this.x + this.width / 2, this.y + this.height / 2);
        
        if (this.direction === 'left') {
            context.scale(-1, 1);
        }
        
        // Final check: only draw if image is a valid object
        if (this.image && this.image.complete && this.image.nodeType === 1) {
            context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            // Fallback: Yellow torpedo shape if image fails
            context.fillStyle = '#ffcc00';
            context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }
        context.restore();
    }
}

export class EnemyProjectile extends Projectile {
    constructor(game, x, y, image) {
        super(game, x, y, 'left', image);
        // SOLVED: Increased speed from 6 to 9 for a better challenge
        this.speed = 9; 
        this.width = 25;
        this.height = 12;
    }
}