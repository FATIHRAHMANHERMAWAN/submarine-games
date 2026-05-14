export class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 20;
        this.fontFamily = 'Courier New';
        this.color = 'white';
    }

    draw(context) {
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'black';

        if (this.game.gameState === 'home') {
            this.drawMenu(context, 'SUBMARINE MODULAR GAME', 'Click to Deploy', '#00ffff');
        } else if (this.game.gameState === 'playing' || this.game.gameState === 'pausing') {
            this.drawStatus(context);
            if (this.game.gameState === 'pausing') this.drawPause(context);
            if (this.game.showInfo) this.drawInfo(context);
        } else if (this.game.gameState === 'victory') {
            this.drawMenu(context, 'CONGRATULATIONS!', 'Mission Complete. Click to Restart', '#33ff33');
        } else if (this.game.gameState === 'gameOver') {
            this.drawMenu(context, 'GAME OVER', 'Submarine Destroyed. Click to Retry', '#ff3333');
        }
        context.restore();
    }

    drawStatus(context) {
        context.textAlign = 'left';
        context.font = `bold ${this.fontSize}px ${this.fontFamily}`;
        context.fillStyle = '#ffcc00';
        context.fillText(`KILLS: ${this.game.score}/${this.game.victoryCondition}`, 30, 40);
        
        // Health Bar
        context.fillStyle = '#333';
        context.fillRect(30, 60, 150, 15);
        context.fillStyle = this.game.lives > 1 ? '#33ff33' : '#ff3333';
        context.fillRect(30, 60, (this.game.lives / 5) * 150, 15);
        context.strokeStyle = 'white';
        context.strokeRect(30, 60, 150, 15);
    }

    drawMenu(context, title, sub, color) {
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, this.game.width, this.game.height);
        context.textAlign = 'center';
        context.fillStyle = color;
        context.font = `bold 48px ${this.fontFamily}`;
        context.fillText(title, this.game.width / 2, this.game.height / 2 - 20);
        context.fillStyle = 'white';
        context.font = `20px ${this.fontFamily}`;
        context.fillText(sub, this.game.width / 2, this.game.height / 2 + 40);
    }

    drawPause(context) {
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, this.game.width, this.game.height);
        context.textAlign = 'center';
        context.fillStyle = 'white';
        context.font = `30px ${this.fontFamily}`;
        context.fillText('QUIT TO HOME?', this.game.width / 2, this.game.height / 2 - 20);
        context.fillStyle = '#ff3333';
        context.fillText('YES', this.game.width / 2 - 60, this.game.height / 2 + 40);
        context.fillStyle = '#33ff33';
        context.fillText('NO', this.game.width / 2 + 60, this.game.height / 2 + 40);
    }

    drawInfo(context) {
        context.fillStyle = 'rgba(0, 0, 40, 0.9)';
        context.fillRect(this.game.width * 0.2, this.game.height * 0.2, this.game.width * 0.6, this.game.height * 0.6);
        context.strokeStyle = '#00ffff';
        context.strokeRect(this.game.width * 0.2, this.game.height * 0.2, this.game.width * 0.6, this.game.height * 0.6);
        
        context.textAlign = 'center';
        context.fillStyle = '#00ffff';
        context.font = `bold 28px ${this.fontFamily}`;
        context.fillText('CONTROLS', this.game.width / 2, this.game.height * 0.3);
        
        context.fillStyle = 'white';
        context.font = `18px ${this.fontFamily}`;
        const lines = [
            'WASD / Arrows : Movement',
            'Mouse : Aim Direction',
            'F / Left Click : Shoot Torpedo',
            'ESC : Pause Menu',
            'I : Toggle this Info Tab'
        ];
        lines.forEach((line, i) => {
            context.fillText(line, this.game.width / 2, this.game.height * 0.4 + (i * 35));
        });
    }
}