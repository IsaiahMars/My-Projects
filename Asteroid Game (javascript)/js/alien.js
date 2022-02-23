export default class Alien{
    constructor(x, y, speed){
        this.model = document.getElementById("alienModel");
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 60;
        this.speed = speed;
        this.counted = false;
    }
    draw(ctx){
        ctx.drawImage(this.model, this.x, this.y, this.width, this.height)
    }
    update(ctx){
        this.draw(ctx);

        this.x += this.speed.x;
        this.y += this.speed.y;
    }
}