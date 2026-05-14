import { Enemy } from './enemy.js';

export class EntityManager {
    constructor(game) {
        this.game = game;
        
        // Oyun içindeki farklı nesne grupları için listeler (diziler)
        this.enemies = [];          // Düşman denizaltıları
        this.projectiles = [];      // Oyuncunun ateşlediği torpidolar
        this.enemyProjectiles = []; // Düşmanların ateşlediği mermiler
        this.particles = [];        // Patlama efektleri için parçacıklar
        
        // Düşmanların çıkış zamanlaması (milisaniye cinsinden)
        this.enemyTimer = 0;
        this.enemyInterval = 1500; // Her 1.5 saniyede bir yeni düşman oluşturur
    }

    update(deltaTime) {
        // --- Düşman Oluşturma Mantığı ---
        this.enemyTimer += deltaTime;
        if (this.enemyTimer > this.enemyInterval) {
            // Zaman dolduğunda yeni bir düşman nesnesi oluşturur ve listeye ekler
            this.enemies.push(new Enemy(this.game));
            this.enemyTimer = 0;
        }

        // --- Toplu Güncelleme ---
        // Tüm listeleri bir dizi içinde toplar ve her nesnenin update() metodunu çalıştırır
        [this.enemies, this.projectiles, this.enemyProjectiles, this.particles].forEach(group => {
            group.forEach(obj => obj.update(deltaTime));
        });

        // --- Toplu Temizlik (Cleanup) ---
        // 'markedForDeletion' (silinmek üzere işaretlenmiş) olan nesneleri listelerden temizler
        // Bu işlem bellek yönetimi ve performans için kritiktir
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
        this.enemyProjectiles = this.enemyProjectiles.filter(ep => !ep.markedForDeletion);
        this.particles = this.particles.filter(p => !p.markedForDeletion);
    }

    draw(context) {
        // --- Toplu Çizim ---
        // Tüm varlıkları ekrana çizer. Sıralama katman önceliğini belirler:
        // Önce parçacıklar, sonra mermiler ve en üstte denizaltılar görünür.
        [this.particles, this.projectiles, this.enemies, this.enemyProjectiles].forEach(group => {
            group.forEach(obj => obj.draw(context));
        });
    }

    clear() {
        // Oyun yeniden başladığında veya ana menüye dönüldüğünde tüm listeleri sıfırlar
        this.enemies = [];
        this.projectiles = [];
        this.enemyProjectiles = [];
        this.particles = [];
        this.enemyTimer = 0;
    }
}