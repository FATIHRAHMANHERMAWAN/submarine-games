export class InputHandler {
    constructor(canvas) {
        // Aktif olarak basılı tutulan tuşları saklayan dizi
        this.keys = [];
        // Farenin koordinatlarını ve tıklanma durumunu saklayan nesne
        this.mouse = { x: 0, y: 0, pressed: false };

        // Klavyedeki farklı tuşları oyunun anlayacağı ortak isimlere eşler (WASD -> Ok Tuşları gibi)
        const keyMap = {
            'w': 'ArrowUp',    'W': 'ArrowUp',
            's': 'ArrowDown',  'S': 'ArrowDown',
            'a': 'ArrowLeft',  'A': 'ArrowLeft',
            'd': 'ArrowRight', 'D': 'ArrowRight',
            'f': 'Shoot',      'F': 'Shoot',
            'i': 'Info',       'I': 'Info',
            'Escape': 'Escape'
        };

        // Oyunun dikkate alacağı geçerli tuşların listesi
        const allowedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Shoot', 'Escape', 'Info'];

        // Klavye tuşuna basıldığında tetiklenir
        window.addEventListener('keydown', (e) => {
            const targetKey = keyMap[e.key] || e.key;
            // Eğer tuş izin verilenler listesindeyse ve dizide zaten yoksa ekler
            if (allowedKeys.includes(targetKey) && !this.keys.includes(targetKey)) {
                this.keys.push(targetKey);
            }
        });

        // Klavye tuşu bırakıldığında tetiklenir
        window.addEventListener('keyup', (e) => {
            const targetKey = keyMap[e.key] || e.key;
            const index = this.keys.indexOf(targetKey);
            // Tuş bırakıldığında diziden çıkartır
            if (index > -1) this.keys.splice(index, 1);
        });

        // Fare hareket ettiğinde koordinatları günceller
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            // Farenin pencere üzerindeki konumunu canvas koordinatlarına dönüştürür
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        // Fare sol tuşuna basıldığında tetiklenir
        window.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.mouse.pressed = true;
        });

        // Fare sol tuşu bırakıldığında tetiklenir
        window.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.mouse.pressed = false;
        });
    }
}