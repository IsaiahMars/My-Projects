export default class Asteroid{
    constructor(x, y){
        this.model = document.getElementById("asteroidModel");
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = {x: 3, y: 5}
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