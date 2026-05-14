import { Enemy } from './enemy.js';

export class EntityManager {
    constructor(game) {
        this.game = game;
        this.enemies = [];
        this.projectiles = [];
        this.enemyProjectiles = [];
        this.particles = [];
        this.enemyTimer = 0;
        this.enemyInterval = 1500;
    }

    update(deltaTime) {
        // Spawning
        this.enemyTimer += deltaTime;
        if (this.enemyTimer > this.enemyInterval) {
            this.enemies.push(new Enemy(this.game));
            this.enemyTimer = 0;
        }

        // Batch Update
        [this.enemies, this.projectiles, this.enemyProjectiles, this.particles].forEach(group => {
            group.forEach(obj => obj.update(deltaTime));
        });

        // Batch Cleanup
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
        this.enemyProjectiles = this.enemyProjectiles.filter(ep => !ep.markedForDeletion);
        this.particles = this.particles.filter(p => !p.markedForDeletion);
    }

    draw(context) {
        [this.particles, this.projectiles, this.enemies, this.enemyProjectiles].forEach(group => {
            group.forEach(obj => obj.draw(context));
        });
    }

    clear() {
        this.enemies = [];
        this.projectiles = [];
        this.enemyProjectiles = [];
        this.particles = [];
        this.enemyTimer = 0;
    }
}