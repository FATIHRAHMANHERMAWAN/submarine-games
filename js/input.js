// js/input.js
export class InputHandler {
    constructor(canvas) {
        this.keys = [];
        this.mouse = { x: 0, y: 0 };

        // Key Translation Map: Redirects WASD inputs into standard Arrow strings
        const keyMap = {
            'w': 'ArrowUp',    'W': 'ArrowUp',
            's': 'ArrowDown',  'S': 'ArrowDown',
            'a': 'ArrowLeft',  'A': 'ArrowLeft',
            'd': 'ArrowRight', 'D': 'ArrowRight'
        };

        const allowedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

        window.addEventListener('keydown', (e) => {
            // If the pressed key is in our map, translate it. Otherwise, use the original string.
            const targetKey = keyMap[e.key] || e.key;

            if (allowedKeys.includes(targetKey) && !this.keys.includes(targetKey)) {
                this.keys.push(targetKey);
            }
        });

        window.addEventListener('keyup', (e) => {
            const targetKey = keyMap[e.key] || e.key;
            const index = this.keys.indexOf(targetKey);
            if (index > -1) {
                this.keys.splice(index, 1);
            }
        });

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }
}