export class Particle {
    constructor(game, x, y) {
        this.game = game;
        
        // Parçacığın patlama anındaki merkez konumu
        this.x = x;
        this.y = y;
        
        // Parçacığın yarıçapını rastgele belirler (2 ile 7 piksel arası)
        this.size = Math.random() * 5 + 2;
        
        // Parçacığın her yöne rastgele dağılması için X ve Y eksenindeki hızları
        this.speedX = (Math.random() - 0.5) * 6;
        this.speedY = (Math.random() - 0.5) * 6;
        
        // Başlangıç şeffaflığı (1 = tamamen görünür)
        this.alpha = 1;
        
        // Parçacığın her karede ne kadar hızlı yok olacağını (şeffaflaşacağını) belirler
        this.decay = Math.random() * 0.02 + 0.01;
        
        // Bellek yönetimi için silinme işareti
        this.markedForDeletion = false;
        
        // Parçacık rengi (Varsayılan olarak parlak sarı/turuncu - patlama rengi)
        this.color = '#ffcc00';
    }

    update() {
        // Parçacığı belirlenen hızda hareket ettirir
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Şeffaflığı zamanla azaltır (yok olma efekti)
        this.alpha -= this.decay;
        
        // Parçacık tamamen şeffaf olduğunda silinmek üzere işaretler
        if (this.alpha <= 0) this.markedForDeletion = true;
    }

    draw(context) {
        context.save();
        
        // Çizim şeffaflığını güncel alpha değerine ayarlar
        context.globalAlpha = this.alpha;
        
        context.fillStyle = this.color;
        context.beginPath();
        
        // Parçacığı küçük bir daire şeklinde çizer
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        context.fill();
        context.restore();
    }
}