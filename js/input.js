export class InputHandler {
    constructor() {
        this.keys = [];
        window.addEventListener('keydown', (e) => {
            if ((e.key === 'ArrowUp' || 
                 e.key === 'ArrowDown' || 
                 e.key === 'ArrowLeft' || 
                 e.key === 'ArrowRight') && 
                this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }
        });
        window.addEventListener('keyup', (e) => {
            const index = this.keys.indexOf(e.key);
            if (index > -1) this.keys.splice(index, 1);
        });
    }
}