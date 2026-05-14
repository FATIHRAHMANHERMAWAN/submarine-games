import { EnemyProjectile } from './projectile.js';

export class Enemy {
    constructor(game, image) {
        this.game = game;
        this.image = document.getElementById('enemySubmarineSprite');; // Pre-loaded pixel-art submarine sprite element
        
        // Match dimensions to the sprite's design
        this.width = 60; // Keep the existing game-space size
        this.height = 40; // Keep the existing game-space size
        this.x = this.game.width;
        
        // Spawns randomly along the vertical water axis
        this.y = Math.random() * (this.game.height - this.height - 120) + 40; 
        this.speed = Math.random() * 2 + 1.5;
        this.markedForDeletion = false;

        this.shootTimer = 0;
        this.shootInterval = Math.random() * 1200 + 800; // Fires every 0.8 to 2 seconds
    }
    update(deltaTime) {
        this.x -= this.speed;
        if (this.x < -this.width) this.markedForDeletion = true;

        // Automated shooting tracking loop
        this.shootTimer += deltaTime;
        if (this.shootTimer > this.shootInterval) {
            this.shoot();
            this.shootTimer = 0;
        }
    }
    shoot() {
        if (this.x > 0 && this.x < this.game.width) {
            // The sprite nose is on the left, so this shoot position is correct.
            this.game.enemyProjectiles.push(new EnemyProjectile(this.game, this.x, this.y + this.height / 2));
        }
    }
    draw(context) {
        //context.fillStyle = '#4d6666'; // Old shape hull
        //context.fillRect(this.x, this.y, this.width, this.height);
        
        //context.fillStyle = '#ff3333'; // Old shape eye panel
        //context.fillRect(this.x + 8, this.y + 12, 12, 8);
        
        context.save();
        
        // Since the enemy sub is moving left and the detailed sub sprite is moving right,
        // we flip the drawing horizontally.
        context.translate(this.x + this.width / 2, this.y + this.height / 2);
        context.scale(-1, 1);
        
        context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        
        context.restore();
    }
}