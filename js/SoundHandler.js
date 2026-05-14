export class SoundHandler {
    constructor() {
        this.bgMusic = new Audio('src/backsound.mp3');
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.4;

        this.shootSound = new Audio('src/torpedosound.ogg');
        this.shootSound.volume = 0.5;
    }

    playMusic() {
        this.bgMusic.play().catch(err => console.log("Music blocked:", err));
    }

    pauseMusic() {
        this.bgMusic.pause();
    }

    resetMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }

    playShoot() {
        this.shootSound.currentTime = 0;
        this.shootSound.play();
    }
}