export default class Player{
    constructor(){
        this.model = document.getElementById("playerModel");
        //this.currentModel = document.getElementById("playerModel");
        this.hitpoints = 3;
        this.dimensions = {w: 35, h: 50};
        this.position = {x: canvas.width / 2, y: canvas.height / 2};
        this.maxSpeed = 4;
        this.speed = {x: 0, y: 0};
    }

    moveUp(){
        this.speed.y = -this.maxSpeed;
    }
    slowUp(){
        this.speed.y = -1;
    }

    moveDown(){
        this.speed.y = this.maxSpeed;
    }
    slowDown(){
        this.speed.y = 1;
    }

    moveLeft(){
        this.speed.x = -this.maxSpeed;
        this.model = document.getElementById("playerModelLeft")
        //this.currentModel = document.getElementById("playerModelLeft")
    }
    slowLeft(){
        this.speed.x = -1;
    }

    moveRight(){
        this.speed.x = this.maxSpeed;
        this.model = document.getElementById("playerModel")
        //this.currentModel = document.getElementById("playerModel")
    }
    slowRight(){
        this.speed.x = 1;
    }

    stop(){
        this.speed.x = 0;
        this.speed.y = 0;
    }

    draw(ctx){
        ctx.drawImage(this.model, this.position.x, this.position.y, this.dimensions.w, this.dimensions.h);
    }

    update(ctx){
        this.draw(ctx);

        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        if(this.position.x < 0) this.position.x = 0;
        if(this.position.x > 800 - this.dimensions.w) this.position.x = 800 - this.dimensions.w;
        if(this.position.y < 0) this.position.y = 0;
        if(this.position.y > 600 - this.dimensions.h) this.position.y = 600 - this.dimensions.h;
    }
}