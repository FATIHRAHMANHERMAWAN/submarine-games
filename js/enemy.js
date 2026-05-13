import { EnemyProjectile } from './projectile.js';

export class Enemy {
    constructor(game) {
        this.game = game;
        this.width = 60;
        this.height = 40;
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
            this.game.enemyProjectiles.push(new EnemyProjectile(this.game, this.x, this.y + this.height / 2));
        }
    }
    draw(context) {
        context.fillStyle = '#4d6666'; // Dark mechanical enemy hull green
        context.fillRect(this.x, this.y, this.width, this.height);
        
        // Enemy visual eye panel
        context.fillStyle = '#ff3333';
        context.fillRect(this.x + 8, this.y + 12, 12, 8);
    }
}