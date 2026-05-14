export class SoundHandler {
    constructor() {
        // Arkaplan müziği dosyasını yükler
        this.bgMusic = new Audio('src/backsound.mp3');
        // Müziğin bittiğinde otomatik olarak başa dönmesini sağlar
        this.bgMusic.loop = true;
        // Arkaplan müziği ses seviyesini ayarlar (0.0 ile 1.0 arası)
        this.bgMusic.volume = 0.4;

        // Ateş etme (torpido) ses efektini yükler
        this.shootSound = new Audio('src/torpedosound.ogg');
        // Efekt ses seviyesini ayarlar
        this.shootSound.volume = 0.5;
    }

    playMusic() {
        // Müziği başlatır. Tarayıcıların "otomatik oynatma" engeline takılırsa hatayı konsola yazdırır.
        this.bgMusic.play().catch(err => console.log("Müzik engellendi:", err));
    }

    pauseMusic() {
        // Müziği olduğu yerde durdurur
        this.bgMusic.pause();
    }

    resetMusic() {
        // Müziği durdurur ve en başa (0. saniyeye) sarar
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }

    playShoot() {
        // Sesin her tetiklendiğinde en baştan çalması için süreyi sıfırlar
        // Bu sayede seri atış yapıldığında ses üst üste binebilir veya hızlıca yenilenebilir
        this.shootSound.currentTime = 0;
        this.shootSound.play();
    }
}