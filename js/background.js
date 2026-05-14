class Layer {
    constructor(game, image, speedModifier) {
        this.game = game;
        this.image = image;
        this.speedModifier = speedModifier;
        
        // Görselin orijinal boyutları (PNG genişliği ve yüksekliği)
        this.width = 1768; 
        this.height = 500; 
        
        // Başlangıç koordinatları
        this.x = 0;
        this.y = 0;
    }

    update() {
        // Arkaplan sadece oyun 'playing' (oynanıyor) durumundaysa ve bilgi ekranı kapalıysa hareket eder
        if (this.game.gameState === 'playing' && this.game.showinfocondition === false) {
            // Görsel tamamen sola kaydığında konumu sıfırlayarak sonsuz döngü oluşturur
            if (this.x <= -this.width) this.x = 0;
            
            // Oyun hızı ve katmanın kendi hız çarpanına göre sola kayma miktarını hesaplar
            this.x -= this.game.speed * this.speedModifier;
        }
    }

    draw(context) {
        // İlk kopyayı çizdirir (Yüksekliği oyun penceresine göre esnetir)
        context.drawImage(this.image, this.x, 0, this.width, this.game.height);
        
        // Görselin bitişine ikinci kopyayı ekleyerek boşluk kalmasını engeller
        context.drawImage(this.image, this.x + this.width, 0, this.width, this.game.height);
        
        // Eğer ekran genişliği görselden daha büyükse, sağ tarafta siyah boşluk kalmaması için üçüncü bir kopya çizer
        if (this.game.width > this.width) {
            context.drawImage(this.image, this.x + (this.width * 2), 0, this.width, this.game.height);
        }
    }
}

export class Background {
    constructor(game) {
        this.game = game;
        
        // Tüm paralaks katmanlarını farklı hız çarpanlarıyla tanımlar
        // Katmanlar diziliş sırasına göre (arkadan öne doğru) çizilir
        this.layers = [
            new Layer(this.game, document.getElementById('layer6'), 0.1),
            new Layer(this.game, document.getElementById('layer1'), 0.2),
            new Layer(this.game, document.getElementById('layer3'), 0.4),
            new Layer(this.game, document.getElementById('layer4'), 0.6),
            new Layer(this.game, document.getElementById('layer2'), 0.8),
            new Layer(this.game, document.getElementById('layer5'), 1.2),
        ];
    }

    update() {
        // Listedeki tüm katmanların konumlarını tek tek günceller
        this.layers.forEach(layer => layer.update());
    }

    draw(context) {
        // Listedeki tüm katmanları sırayla ekrana çizer
        this.layers.forEach(layer => layer.draw(context));
    }
}