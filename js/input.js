// js/input.js
export class InputHandler {
    constructor(canvas) { // Pass the canvas element here
        this.keys = [];
        this.mouse = { x: 0, y: 0 }; // Track mouse coordinates

        // Keyboard tracking
        window.addEventListener('keydown', (e) => {
            if ((e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
                 e.key === 'ArrowLeft' || e.key === 'ArrowRight') && 
                this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }
        });
        window.addEventListener('keyup', (e) => {
            const index = this.keys.indexOf(e.key);
            if (index > -1) this.keys.splice(index, 1);
        });

        // Mouse tracking
        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            // Calculate mouse position relative strictly to the canvas viewport
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }
}