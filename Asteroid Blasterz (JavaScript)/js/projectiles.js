export default class Projectile{
    constructor(x, y, speed){
        //this.model = document.getElementById('projectileModel');
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.speed = speed;
        
    }
    draw(ctx){
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgb(57, 255, 20)';
        ctx.fill();
        
    }
    update(ctx){
        this.draw(ctx)

        this.x += this.speed.x;
        this.y += this.speed.y;
    }
}