// Oyun içindeki oyuncu durumlarını temsil eden sabitler
export const states = {
    IDLE: 0,              // Durma/Boşta
    MOVING_UP: 1,         // Yukarı hareket
    MOVING_DOWN: 2,       // Aşağı hareket
    MOVING_HORIZONTAL: 3  // Yatay (Sağ-Sol) hareket
};

// Tüm durumların türetildiği temel Sınıf
class State {
    constructor(state) {
        this.state = state;
    }
}

// DURMA (IDLE) DURUMU
export class Idle extends State {
    constructor(player) {
        super(states.IDLE);
        this.player = player;
    }
    // Bu duruma ilk girildiğinde çalışır
    enter() {
        // Sprite sayfasındaki nötr/standart satıra geçer
        this.player.frameY = 0; 
    }
    // Tuş girişlerine göre durum değiştirme mantığı
    handleInput(input) {
        if (input.keys.includes('ArrowUp')) {
            this.player.setState(states.MOVING_UP);
        } else if (input.keys.includes('ArrowDown')) {
            this.player.setState(states.MOVING_DOWN);
        } else if (input.keys.includes('ArrowLeft') || input.keys.includes('ArrowRight')) {
            this.player.setState(states.MOVING_HORIZONTAL);
        }
    }
}

// YATAY HAREKET DURUMU
export class MovingHorizontal extends State {
    constructor(player) {
        super(states.MOVING_HORIZONTAL);
        this.player = player;
    }
    enter() {
        // Yatay hareket için uygun animasyon satırını seçer
        this.player.frameY = 0; 
    }
    handleInput(input) {
        if (input.keys.includes('ArrowUp')) {
            this.player.setState(states.MOVING_UP);
        } else if (input.keys.includes('ArrowDown')) {
            this.player.setState(states.MOVING_DOWN);
        } else if (!input.keys.includes('ArrowLeft') && !input.keys.includes('ArrowRight')) {
            // Hiçbir yatay tuşa basılmıyorsa durma durumuna döner
            this.player.setState(states.IDLE);
        }
    }
}

// YUKARI HAREKET (YÜKSELME) DURUMU
export class MovingUp extends State {
    constructor(player) {
        super(states.MOVING_UP);
        this.player = player;
    }
    enter() {
        // Denizaltının altından baloncuklar çıkan yükselme animasyon satırı
        this.player.frameY = 5; 
    }
    handleInput(input) {
        // Yukarı tuşu bırakıldığında ne yapılacağına karar verir
        if (!input.keys.includes('ArrowUp')) {
            if (input.keys.includes('ArrowDown')) this.player.setState(states.MOVING_DOWN);
            else if (input.keys.includes('ArrowLeft') || input.keys.includes('ArrowRight')) this.player.setState(states.MOVING_HORIZONTAL);
            else this.player.setState(states.IDLE);
        }
    }
}

// AŞAĞI HAREKET (DALIŞ) DURUMU
export class MovingDown extends State {
    constructor(player) {
        super(states.MOVING_DOWN);
        this.player = player;
    }
    enter() {
        // Dalış efektlerinin ve akıntı çizgilerinin olduğu animasyon satırı
        this.player.frameY = 4; 
    }
    handleInput(input) {
        // Aşağı tuşu bırakıldığında geçilecek yeni durumu belirler
        if (!input.keys.includes('ArrowDown')) {
            if (input.keys.includes('ArrowUp')) this.player.setState(states.MOVING_UP);
            else if (input.keys.includes('ArrowLeft') || input.keys.includes('ArrowRight')) this.player.setState(states.MOVING_HORIZONTAL);
            else this.player.setState(states.IDLE);
        }
    }
}