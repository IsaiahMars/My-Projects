export default class Path {
    constructor(width, height, x, y, buttonId){
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.button = document.getElementById(buttonId);
    }

    draw(context){
        context.fillStyle = 'rgba(0,0,0,0)';
        context.fillRect(this.x, this.y, this.width, this.height)
    }

    update(){
        
    }
}