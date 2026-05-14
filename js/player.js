import { Idle, MovingUp, MovingDown, MovingHorizontal, states } from './state.js';
import { Projectile } from './projectile.js';

export class Player {
    constructor(game) {
        this.game = game;
        // HTML üzerindeki submarineSprite ID'li görseli bağlar
        this.image = document.getElementById('submarineSprite');
        
        // Sprite sayfasındaki her bir hücrenin boyutunu hesaplar (677/4 ve 369/2)
        this.sw = 169.25; 
        this.sh = 184.5;

        // Ekranda çizilecek temel boyutlar ve ölçeklendirme
        this.width = 60;  
        this.height = 45; 
        this.renderScale = 1.5; 
        this.renderWidth = this.width * this.renderScale;
        this.renderHeight = this.height * this.renderScale;

        // Başlangıç konumunu ekranın ortası olarak ayarlar
        this.x = this.game.width / 2 - this.renderWidth / 2;
        this.y = this.game.height / 2 - this.renderHeight / 2;
        
        // Sprite sayfasındaki aktif kare (koordinat bazlı)
        this.frameX = 0; 
        this.frameY = 0; 

        // Fizik motoru değişkenleri (Hız, ivme ve sürtünme)
        this.vx = 0; 
        this.vy = 0; 
        this.acceleration = 0.5; 
        this.friction = 0.92; 

        this.maxSpeed = 6;
        this.facing = 'right'; // Bakış yönü (sağ veya sol)

        // Ateş etme zamanlayıcısı ve bekleme süresi
        this.shootTimer = 0;
        this.shootCooldown = 200; 

        // Durum makinesi (State Machine) kurulumu
        this.states = [
            new Idle(this),              
            new MovingUp(this),          
            new MovingDown(this),        
            new MovingHorizontal(this)   
        ];
        this.currentState = null;
        this.setState(states.IDLE);
    }

    shoot() {
        // Merminin denizaltının bakış yönüne göre doğru uçtan çıkmasını sağlar
        let spawnX = this.x + (this.facing === 'right' ? this.renderWidth : 0);
        const img = document.getElementById('playerProjectileSprite');
        
        // Mermiyi ortak EntityManager listesine ekler
        this.game.entities.projectiles.push(
            new Projectile(this.game, spawnX, this.y + this.renderHeight / 2, this.facing, img)
        );

        // Ateş etme sesini çalar
        this.game.sounds.playShoot();
    }

    update(input, deltaTime) {
        // Durum makinesini başlatır ve girdileri kontrol eder
        if (!this.currentState) this.setState(states.IDLE);
        this.currentState.handleInput(input);

        // Klavye girdilerine göre ivmelenme hesaplar (Ok tuşları)
        if (input.keys.includes('ArrowUp')) this.vy -= this.acceleration;
        if (input.keys.includes('ArrowDown')) this.vy += this.acceleration;
        if (input.keys.includes('ArrowLeft')) this.vx -= this.acceleration;
        if (input.keys.includes('ArrowRight')) this.vx += this.acceleration;

        // Sıvı hissi vermek için sürtünme uygular ve konumu günceller
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;

        // Dikey hıza göre sprite sayfasındaki ilgili kareyi seçer (Animasyon haritalama)
        if (this.vy < -2.0) {
            this.frameX = 2; this.frameY = 0; // Sert Yukarı
        } else if (this.vy < -0.5) {
            this.frameX = 1; this.frameY = 0; // Hafif Yukarı
        } else if (this.vy > 2.0) {
            this.frameX = 2; this.frameY = 1; // Sert Aşağı
        } else if (this.vy > 0.5) {
            this.frameX = 3; this.frameY = 0; // Hafif Aşağı
        } else {
            this.frameX = 0; this.frameY = 0; // Sabit/Nötr
        }

        // Karakterin bakış yönünü belirler (Hız öncelikli, hız düşükse fare odaklı)
        if (this.vx > 0.2) this.facing = 'right';
        else if (this.vx < -0.2) this.facing = 'left';
        else {
            const playerCenterX = this.x + this.renderWidth / 2;
            if (Math.abs(input.mouse.x - playerCenterX) > 20) {
                this.facing = input.mouse.x < playerCenterX ? 'left' : 'right';
            }
        }

        // Ateş etme kontrolü ve bekleme süresi yönetimi
        if (this.shootTimer < this.shootCooldown) this.shootTimer += deltaTime;
        if ((input.keys.includes('Shoot') || input.mouse.pressed) && this.shootTimer >= this.shootCooldown) {
            this.shoot();
            this.shootTimer = 0;
        }

        // Denizaltının ekran sınırlarından dışarı çıkmasını engeller
        if (this.x < 0) { this.x = 0; this.vx = 0; }
        if (this.x > this.game.width - this.renderWidth) { this.x = this.game.width - this.renderWidth; this.vx = 0; }
        if (this.y < 0) { this.y = 0; this.vy = 0; }
        if (this.y > this.game.height - this.renderHeight) { this.y = this.game.height - this.renderHeight; this.vy = 0; }
    }

    setState(stateIndex) {
        // Oyuncunun durumunu değiştirir (Idle, Moving vb.)
        if (this.states[stateIndex]) {
            this.currentState = this.states[stateIndex];
            this.currentState.enter();
        }
    }

    draw(context) {
        if (!this.image.complete) return; 

        context.save();
        
        // Çizim koordinatlarını denizaltının merkezine taşır
        context.translate(this.x + this.renderWidth / 2, this.y + this.renderHeight / 2);

        // Eğer denizaltı sola bakıyorsa görseli yatayda ters çevirir (Aynalama)
        if (this.facing === 'left') {
            context.scale(-1, 1);
        }

        // Sprite sayfasından ilgili hücreyi keser ve ekrana çizer
        context.drawImage(
            this.image,
            this.frameX * this.sw, this.frameY * this.sh, // Kaynak görsel kırpma (X, Y)
            this.sw, this.sh,                             // Kaynak görsel kırpma boyutu
            -this.renderWidth / 2, -this.renderHeight / 2, // Çizim konumu (Merkezleme)
            this.renderWidth, this.renderHeight           // Çizim boyutu
        );

        context.restore();
    }
}