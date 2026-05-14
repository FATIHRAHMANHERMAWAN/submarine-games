import { EnemyProjectile } from './projectile.js';

export class Enemy {
    constructor(game) {
        this.game = game;
        
        // HTML içindeki ID'yi kullanarak düşman görselini alır
        this.image = document.getElementById('enemySubmarineSprite');
        
        // Düşman denizaltısının boyutları
        this.width = 60; 
        this.height = 40; 
        
        // Düşmanın ekranın en sağından başlamasını sağlar
        this.x = this.game.width;
        
        // Düşmanın dikey konumunu rastgele belirler (üst ve alttan pay bırakır)
        this.y = Math.random() * (this.game.height - this.height - 120) + 40; 
        
        // Düşmanın ilerleme hızını rastgele belirler
        this.speed = Math.random() * 2 + 1.5;
        this.markedForDeletion = false;

        // Ateş etme zamanlaması için gerekli değişkenler
        this.shootTimer = 0;
        
        // Her düşmanın farklı aralıklarla ateş etmesini sağlar (800ms ile 2000ms arası)
        this.shootInterval = Math.random() * 1200 + 800; 
    }

    update(deltaTime) {
        // Düşmanı sola doğru hareket ettirir
        this.x -= this.speed;
        
        // Ekrandan tamamen çıkan düşmanları silinmek üzere işaretler
        if (this.x < -this.width) this.markedForDeletion = true;

        // Ateş etme zamanlayıcısını günceller
        this.shootTimer += deltaTime;
        
        // Süre dolduğunda ateş eder ve zamanlayıcıyı sıfırlar
        if (this.shootTimer > this.shootInterval) {
            this.shoot();
            this.shootTimer = 0;
        }
    }

    shoot() {
        // Mermi görselini alır (Eğer düşman mermisi görseli yoksa oyuncununkini kullanır)
        const img = document.getElementById('enemyProjectileSprite') || document.getElementById('playerProjectileSprite');
        
        // Merminin düşmanın ön kısmından çıkmasını sağlar
        const spawnX = this.x;
        const spawnY = this.y + this.height / 2;

        // Yeni mermiyi modüler EntityManager içindeki listeye ekler
        this.game.entities.enemyProjectiles.push(
            new EnemyProjectile(this.game, spawnX, spawnY, img)
        );
    }
    
    draw(context) {
        context.save();
        
        // Düşmanı kendi merkezinde döndürmek/çevirmek için koordinat sistemini taşır
        context.translate(this.x + this.width / 2, this.y + this.height / 2);
        
        // Düşmanın sola bakması için görseli yatayda ters çevirir
        context.scale(-1, 1);
        
        // Görseli merkeze göre hizalayarak çizer
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