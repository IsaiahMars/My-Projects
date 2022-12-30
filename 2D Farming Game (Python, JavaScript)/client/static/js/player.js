export default class Player {
    constructor(game, x, y){
        this.game = game;
        this.spriteWidth = 100;
        this.spriteHeight = 98;
        this.frameX = 0;
        this.frameY = 2;
        this.maxFrame = 8;
        this.width = this.spriteWidth;
        this.height = this.spriteHeight;
        this.x = x;
        this.y = y;
        this.stopped = true;
        this.speedX = 0;
        this.speedY = 0;
        this.maxSpeed = 3;
        this.image = document.getElementById('character')
        this.fps = 13;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
    }

    setSpeed(speedX, speedY){
        this.speedX = speedX;
        this.speedY = speedY;
    }

    draw(context){
        context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width + 5, this.height + 5);
    }

    update(deltaTime){
        if (this.game.lastKey == 'P ArrowLeft'){
            this.setSpeed(-this.maxSpeed, 0);
            this.frameY = 1;
            this.stopped = false;
        }
        else if (this.game.lastKey == 'R ArrowLeft' && this.speedX < 0){
            this.setSpeed(0, 0);
            this.frameX = 0;
            this.stopped = true;
        }
        else if (this.game.lastKey == 'P ArrowRight'){
            this.setSpeed(this.maxSpeed, 0);
            this.frameY = 3;
            this.stopped = false;
        }
        else if (this.game.lastKey == 'R ArrowRight' && this.speedX > 0){
            this.setSpeed(0, 0);
            this.frameX = 0;
            this.stopped = true;
        }
        else if (this.game.lastKey == 'P ArrowDown'){
            this.setSpeed(0, this.maxSpeed * .6);
            this.frameY = 2;
            this.stopped = false;
        }
        else if (this.game.lastKey == 'R ArrowDown' && this.speedY > 0){
            this.setSpeed(0, 0);
            this.frameX = 0;
            this.stopped = true;
        }
        else if (this.game.lastKey == 'P ArrowUp'){
            this.setSpeed(0, -this.maxSpeed * 0.6);
            this.frameY = 0;
            this.stopped = false;
        }
        else if (this.game.lastKey == 'R ArrowUp' && this.speedY < 0){
            this.setSpeed(0, 0);
            this.frameX = 0;
            this.stopped = true;
        }
        
        this.x += this.speedX
        this.y += this.speedY

        if (this.x < -20){
            this.x = -20
        }
        else if (this.x + this.width - 25 > this.game.width){
            this.x = this.game.width - this.width + 25;
        }
        else if (this.y < this.game.topMargin){
            this.y = this.game.topMargin
        }
        else if (this.y > this.game.height - this.height - 10){
            this.y = this.game.height - this.height - 10
        }
        
        if(!this.stopped){                                                          
            if (this.frameTimer > this.frameInterval){
                this.frameX < this.maxFrame ? this.frameX++ : this.frameX = 0;
                this.frameTimer = 0;
            }
            else{
                this.frameTimer += deltaTime;
            }
        }
    }
}
