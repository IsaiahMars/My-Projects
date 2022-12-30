export default class Message {
    constructor(game, x, y, message, category){
        this.game = game;
        this.message = message;
        this.category = category;
        this.x = x;
        this.y = y;
        this.opacity = 1;
    }

    draw(context){
        context.font = "30px Verdana";
        if(this.category == "success"){
            context.fillStyle = "rgba(255, 255, 255, " + this.opacity + ")";
        }
        else{
            context.fillStyle = "rgba(255, 0, 0, " + this.opacity + ")";
        }
        context.textAlign = "center";
        context.fillText(this.message, this.x, this.y);
    }

    update(){
        this.y++;
        this.opacity -= .01;
        if(this.game.messages.length > 1){
            this.game.messages.splice(0, 1)
        }
        if(this.y > 730 && this.game.messages.length > 1){
            this.game.messages.pop()
        }
    }
}