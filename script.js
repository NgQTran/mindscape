window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 720;

    const cupSfx = document.getElementById('cup-sfx');
    const cakeSfx = document.getElementById('cake-sfx');

    class InputHandler {
        constructor(game) {
            this.game = game;
            window.addEventListener('keydown', e => {
                this.game.lastKey = 'P' + e.key;
            });
            window.addEventListener('keyup', e => {
                this.game.lastKey = 'R' + e.key;
            });
        }
    }

    class Player {
        constructor(game) {
            this.game = game;
            this.spriteWidth = 140;
            this.spriteHeight = 249;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.frameX = 0;
            this.frameY = 1;
            this.maxFrame = 31;
            this.x = 100;
            this.y = 380;
            this.speedX = 0;
            this.maxSpeed = 2;
            this.image = document.getElementById('player');
            this.fps = 30;
            this.frameInterval = 1000 / this.fps;
            this.frameTimer = 0;
        }

        draw(context) {
            context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }

        setSpeed(speedX) {
            this.speedX = speedX;
        }

        update(deltaTime) {
            if (this.game.lastKey == 'PArrowLeft') {
                this.setSpeed(-this.maxSpeed, 0);
                this.frameY = 3;
            } else if (this.game.lastKey == 'RArrowLeft' && this.speedX < 0) {
                this.setSpeed(0, 0);
                this.frameY = 2;
            } else if (this.game.lastKey == 'PArrowRight') {
                this.setSpeed(this.maxSpeed, 0);
                this.frameY = 1;
            } else if (this.game.lastKey == 'RArrowRight' && this.speedX > 0) {
                this.setSpeed(0, 0);
                this.frameY = 0;
            }
            this.x += this.speedX;

            // horizontal boundaries
            if (this.x < 0) {
                this.x = 0;
            } else if (this.x > this.game.width - this.width) {
                this.x = this.game.width - this.width;
            }

            // sprite animation
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX < this.maxFrame) {
                    this.frameX++;
                } else {
                    this.frameX = 0;
                }
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
        }
    }

    class Table {
        constructor(game) {
            this.game = game;
            this.image = document.getElementById('table');
            this.spriteWidth = 305;
            this.spriteHeight = 258;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = 400;
            this.y = 370;
        }

        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    class Cup {
        constructor(game) {
            this.game = game;
            this.image = document.getElementById('cup');
            this.spriteWidth = 56;
            this.spriteHeight = 42;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = 450;
            this.y = 350;
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

    class Cake {
        constructor(game) {
            this.game = game;
            this.image = document.getElementById('cake');
            this.spriteWidth = 81;
            this.spriteHeight = 48;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.x = 520;
            this.y = 360;
    }

            draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
    }

    class NPC {
        constructor(game) {
            this.game = game;
            this.spriteWidth = 300;
            this.spriteHeight = 487;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.frameX = 0;
            this.frameY = 0;
            this.maxFrame = 12;
            this.x = 650;
            this.y = 150;
            this.image = document.getElementById('npc');
            this.fps = 2;
            this.frameInterval = 1000 / this.fps;
            this.frameTimer = 0;
        }

        draw(context) {
            context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }

        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                this.frameX = (this.frameX + 1) % this.maxFrame;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
        }
    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.lastKey = undefined;
            this.input = new InputHandler(this);
            this.player = new Player(this);
            this.table = new Table(this);
            this.cup = new Cup (this);
            this.cake = new Cake (this);
            this.npc = new NPC(this);
        }

        render(context, deltaTime) {
            this.npc.draw(context);
            this.npc.update(deltaTime);
            this.table.draw(context);
            this.cup.draw(context);
            this.cake.draw(context);
            this.player.draw(context);
            this.player.update(deltaTime);
        }

        checkCollision(rect1, rect2) {
            return (
                rect1.x < rect2.x + rect2.width &&
                rect1.x + rect1.width > rect2.x &&
                rect1.y < rect2.y + rect2.height &&
                rect1.y + rect1.height > rect2.y
            );
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx, deltaTime);
        
                if (game.checkCollision(game.player, game.npc)) {
                    document.getElementById('text-box').style.display = 'block';
                } else {
                    document.getElementById('text-box').style.display = 'none';
                }
        requestAnimationFrame(animate);
    }
    animate(0);
});