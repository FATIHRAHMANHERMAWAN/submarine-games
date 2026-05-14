export class UI {
    constructor(game) {
        this.game = game;
        // Metin boyutu ve font ayarları
        this.fontSize = 20;
        this.fontFamily = 'Courier New';
        this.color = 'white';
    }

    draw(context) {
        context.save();
        
        // Tüm metinlere hafif bir gölge ekleyerek okunabilirliği artırır
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'black';

        // Oyunun mevcut durumuna göre hangi ekranın çizileceğine karar verir
        if (this.game.gameState === 'home') {
            // Ana menü ekranı
            this.drawMenu(context, 'DENİZALTI MODÜLER OYUN', 'Başlamak için Tıkla', '#00ffff');
        } else if (this.game.gameState === 'playing' || this.game.gameState === 'pausing') {
            // Oyun içi HUD (Can barı ve Skor)
            this.drawStatus(context);
            
            // Eğer oyun duraklatılmışsa duraklatma menüsünü çizer
            if (this.game.gameState === 'pausing') this.drawPause(context);
            
            // Bilgi ekranı (I tuşu) açıksa kontrolleri çizer
            if (this.game.showInfo) this.drawInfo(context);
        } else if (this.game.gameState === 'victory') {
            // Zafer ekranı
            this.drawMenu(context, 'TEBRİKLER!', 'Görev Tamamlandı. Yeniden Başlamak için Tıkla', '#33ff33');
        } else if (this.game.gameState === 'gameOver') {
            // Oyun bitti ekranı
            this.drawMenu(context, 'OYUN BİTTİ', 'Denizaltı İmha Edildi. Tekrar Denemek için Tıkla', '#ff3333');
        }
        
        context.restore();
    }

    drawStatus(context) {
        context.textAlign = 'left';
        context.font = `bold ${this.fontSize}px ${this.fontFamily}`;
        context.fillStyle = '#ffcc00';
        
        // Skor tabelasını (Kills) çizer
        context.fillText(`AVLANAN: ${this.game.score}/${this.game.victoryCondition}`, 30, 40);
        
        // --- Can Barı Çizimi ---
        // Arkaplan (Gri boş bar)
        context.fillStyle = '#333';
        context.fillRect(30, 60, 150, 15);
        
        // Mevcut can miktarı (Can 1'den fazlaysa yeşil, 1 ise kırmızı olur)
        context.fillStyle = this.game.lives > 1 ? '#33ff33' : '#ff3333';
        context.fillRect(30, 60, (this.game.lives / 5) * 150, 15);
        
        // Barın beyaz çerçevesi
        context.strokeStyle = 'white';
        context.strokeRect(30, 60, 150, 15);
    }

    drawMenu(context, title, sub, color) {
        // Ekranın üzerine yarı saydam bir karartma çeker
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, this.game.width, this.game.height);
        
        context.textAlign = 'center';
        
        // Ana başlığı çizer
        context.fillStyle = color;
        context.font = `bold 48px ${this.fontFamily}`;
        context.fillText(title, this.game.width / 2, this.game.height / 2 - 20);
        
        // Alt başlığı (talimatı) çizer
        context.fillStyle = 'white';
        context.font = `20px ${this.fontFamily}`;
        context.fillText(sub, this.game.width / 2, this.game.height / 2 + 40);
    }

    drawPause(context) {
        // Duraklatma menüsü karartması
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, this.game.width, this.game.height);
        
        context.textAlign = 'center';
        context.fillStyle = 'white';
        context.font = `30px ${this.fontFamily}`;
        context.fillText('ANA MENÜYE DÖNÜLSÜN MÜ?', this.game.width / 2, this.game.height / 2 - 20);
        
        // Evet/Hayır seçenekleri
        context.fillStyle = '#ff3333';
        context.fillText('EVET', this.game.width / 2 - 60, this.game.height / 2 + 40);
        context.fillStyle = '#33ff33';
        context.fillText('HAYIR', this.game.width / 2 + 60, this.game.height / 2 + 40);
    }

    drawInfo(context) {
        // Bilgi kutusunun arkaplanı ve çerçevesi
        context.fillStyle = 'rgba(0, 0, 40, 0.9)';
        context.fillRect(this.game.width * 0.2, this.game.height * 0.2, this.game.width * 0.6, this.game.height * 0.6);
        context.strokeStyle = '#00ffff';
        context.strokeRect(this.game.width * 0.2, this.game.height * 0.2, this.game.width * 0.6, this.game.height * 0.6);
        
        context.textAlign = 'center';
        context.fillStyle = '#00ffff';
        context.font = `bold 28px ${this.fontFamily}`;
        context.fillText('KONTROLLER', this.game.width / 2, this.game.height * 0.3);
        
        context.fillStyle = 'white';
        context.font = `18px ${this.fontFamily}`;
        
        // Kontrol listesini alt alta yazdırır
        const lines = [
            'WASD / Ok Tuşları : Hareket',
            'Fare : Hedef Yönü',
            'F / Sol Tık : Torpido Ateşle',
            'ESC : Duraklatma Menüsü',
            'I : Bilgi Panelini Aç/Kapat'
        ];
        
        lines.forEach((line, i) => {
            context.fillText(line, this.game.width / 2, this.game.height * 0.4 + (i * 35));
        });
    }
}