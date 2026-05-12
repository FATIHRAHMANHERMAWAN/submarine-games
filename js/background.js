// background.js



class Layer {
    constructor(game, image, speedModifier) {
        this.game = game;
        this.image = image;
        this.speedModifier = speedModifier;
        this.width = 1768; // Adjust to the width of your PNGs
        this.height = 500;
        this.x = 0;
        this.y = 0;
    }
    update() {
        if (this.x <= -this.width) this.x = 0;
        // The background moves based on the game's overall speed
        this.x -= this.game.speed * this.speedModifier;
    }
        draw(context) {
        // Note the 'this.game.height' at the end—this stretches the image to fit
        context.drawImage(this.image, this.x, 0, this.width, this.game.height);
        context.drawImage(this.image, this.x + this.width, 0, this.width, this.game.height);
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