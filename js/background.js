// background.js



class Layer {
    constructor(game, image, speedModifier) {
        this.game = game;
        this.image = image;
        this.speedModifier = speedModifier;
        
        // 1. The PNG properties
        this.width = 1768; // The actual width of your PNG files
        this.height = 500; // The actual height of your PNG files
        
        this.x = 0;
        this.y = 0;
    }

    update() {
        // If you want to use the gameState instead of the isPaused flag:
        if (this.game.gameState === 'playing') {
            if (this.x <= -this.width) this.x = 0;
            this.x -= this.game.speed * this.speedModifier;
        }
    }

    draw(context) {
        // 3. THE "STRETCH" FIX
        // We use this.width for the horizontal loop, 
        // but this.game.height to ensure it covers the bottom of the screen.
        context.drawImage(this.image, this.x, 0, this.width, this.game.height);
        context.drawImage(this.image, this.x + this.width, 0, this.width, this.game.height);
        
        // If your screen is WIDER than 1768px, you might need a third copy:
        if (this.game.width > this.width) {
            context.drawImage(this.image, this.x + (this.width * 2), 0, this.width, this.game.height);
        }
    }
}

export class Background {
    constructor(game) {
        this.game = game;
        // Map all your layers
        this.layers = [
            new Layer(this.game, document.getElementById('layer6'), 0.1),
            new Layer(this.game, document.getElementById('layer1'), 0.2),
            new Layer(this.game, document.getElementById('layer3'), 0.4),
            new Layer(this.game, document.getElementById('layer4'), 0.6),
            new Layer(this.game, document.getElementById('layer2'), 0.8),
            new Layer(this.game, document.getElementById('layer5'), 1.2),
        ];
    }
    update() {
        this.layers.forEach(layer => layer.update());
    }
    draw(context) {
        this.layers.forEach(layer => layer.draw(context));
    }
}