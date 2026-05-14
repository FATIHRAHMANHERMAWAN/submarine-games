// enemy.js
import { EnemyProjectile } from './projectile.js';

export class Enemy {
    constructor(game) {
        this.game = game;
        // Using the ID from your HTML
        this.image = document.getElementById('enemySubmarineSprite');
        
        this.width = 60; 
        this.height = 40; 
        this.x = this.game.width;
        
        this.y = Math.random() * (this.game.height - this.height - 120) + 40; 
        this.speed = Math.random() * 2 + 1.5;
        this.markedForDeletion = false;

        this.shootTimer = 0;
        this.shootInterval = Math.random() * 1200 + 800; 
    }

    update(deltaTime) {
        this.x -= this.speed;
        if (this.x < -this.width) this.markedForDeletion = true;

        this.shootTimer += deltaTime;
        if (this.shootTimer > this.shootInterval) {
            this.shoot();
            this.shootTimer = 0;
        }
    }

       shoot() {
        // Make sure 'enemyProjectileSprite' exists in your index.html!
        const img = document.getElementById('enemyProjectileSprite') || document.getElementById('playerProjectileSprite');
        
        const spawnX = this.x;
        const spawnY = this.y + this.height / 2;

        // Push to the new modular EntityManager location
        this.game.entities.enemyProjectiles.push(
            new EnemyProjectile(this.game, spawnX, spawnY, img)
        );
    }
    
    draw(context) {
        context.save();
        
        // Flip the sprite so it faces left (the direction it is moving)
        context.translate(this.x + this.width / 2, this.y + this.height / 2);
        context.scale(-1, 1);
        
        context.drawImage(
            this.image, 
            -this.width / 2, 
            -this.height / 2, 
            this.width, 
            this.height
        );
        
        context.restore();
    }
}