// js/input.js
export class InputHandler {
    constructor(canvas) {
        this.keys = [];
        this.mouse = { x: 0, y: 0, pressed: false };

        const keyMap = {
            'w': 'ArrowUp',    'W': 'ArrowUp',
            's': 'ArrowDown',  'S': 'ArrowDown',
            'a': 'ArrowLeft',  'A': 'ArrowLeft',
            'd': 'ArrowRight', 'D': 'ArrowRight',
            'f': 'Shoot',      'F': 'Shoot',
            'Escape': 'Escape' // Added Escape key support
        };

        const allowedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Shoot', 'Escape'];

        window.addEventListener('keydown', (e) => {
            const targetKey = keyMap[e.key] || e.key;
            if (allowedKeys.includes(targetKey) && !this.keys.includes(targetKey)) {
                this.keys.push(targetKey);
            }
        });

        window.addEventListener('keyup', (e) => {
            const targetKey = keyMap[e.key] || e.key;
            const index = this.keys.indexOf(targetKey);
            if (index > -1) this.keys.splice(index, 1);
        });

        // ... mouse listeners remain the same ...
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        window.addEventListener('mousedown', (e) => {
            if (e.button === 0) this.mouse.pressed = true;
        });
        window.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.mouse.pressed = false;
        });
    }
}