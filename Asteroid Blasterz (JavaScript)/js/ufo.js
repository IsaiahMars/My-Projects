export default class UFO{
    constructor(x, y){
        this.model = document.getElementById("ufoModel");
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 60;
        this.spriteWidth = 492;
        this.spriteHeight = 298;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.gameFrame = 0;
        this.speed = {x: 1.5, y: 3}
        this.counted = false;
        this.updateRuns = 0;
        this.hitpoints = 3;
    }
    draw(ctx){
        ctx.drawImage(this.model, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,
                     this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
    speedChanger(){
        this.speed.y = -this.speed.y;
    }
    animate(){
        if(this.updateRuns % 10 == 0){
            this.frame++;
            if(this.frame >= 6){
                this.frame = 0;
            }
            if(this.frame == 1 || this.frame == 3 || this.frame == 5 || this.frame == 7){
                this.frameX = 0;
            }
            else{
                this.frameX++;
            }
            if(this.frame < 1) this.frameY = 0;
            else if(this.frame < 3) this.frameY = 1;
            else if(this.frame < 5) this.frameY = 2;
            else if(this.frame < 7) this.frameY = 3;
        }
    }

    update(ctx){
        this.updateRuns++;
        this.animate();
        this.draw(ctx);

        this.x += this.speed.x;
        this.y += this.speed.y;
        if(this.updateRuns % 50 == 0){
            this.speedChanger();
        }
    }
}