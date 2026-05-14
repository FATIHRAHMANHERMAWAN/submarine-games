export class Projectile {
    constructor(game, x, y, direction, image) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.image = image; // Mermi görseli (sprite)
        
        // Merminin fiziksel boyutları
        this.width = 32;    
        this.height = 16;
        
        // Merminin temel hızı ve uçuş yönü
        this.speed = 12;
        this.direction = direction;
        
        // Ekrandan çıkan mermileri temizlemek için kullanılan işaret
        this.markedForDeletion = false;
    }

    update() {
        // Mermiyi belirlenen yöne (sağ/sol) göre hareket ettirir
        if (this.direction === 'right') this.x += this.speed;
        else this.x -= this.speed;

        // Mermi ekran sınırlarının dışına çıktığında silinmek üzere işaretler
        if (this.x > this.game.width || this.x < -this.width) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        context.save();
        
        // Çizimi merminin merkezine taşıyarak döndürme/ölçekleme işlemlerini kolaylaştırır
        context.translate(this.x + this.width / 2, this.y + this.height / 2);
        
        // Eğer mermi sola gidiyorsa, görseli yatayda aynalar (ters çevirir)
        if (this.direction === 'left') {
            context.scale(-1, 1);
        }
        
        // Görselin yüklendiğinden emin olup çizimi yapar
        if (this.image && this.image.complete && this.image.nodeType === 1) {
            context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            // Görsel yüklenemezse hata vermemesi için alternatif olarak sarı bir dikdörtgen çizer
            context.fillStyle = '#ffcc00';
            context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }
        
        context.restore();
    }
}

export class EnemyProjectile extends Projectile {
    constructor(game, x, y, image) {
        // Üst sınıfa (Projectile) gerekli bilgileri gönderir (Düşman mermisi her zaman sola gider)
        super(game, x, y, 'left', image);
        
        // Düşman mermisi oyuncuunkinden biraz daha yavaş ama zorlayıcı bir hızda (9) ayarlandı
        this.speed = 9; 
        
        // Düşman mermisinin kendine has boyutları
        this.width = 25;
        this.height = 12;
    }
}