export default class Coins{
    constructor(game){
        this.game = game;
        this.x = 75;
        this.y = 685;
        this.coinX = this.x - 60;
        this.coinY = this.y - 43;
        this.coinImage = document.getElementById('coin');
    }

    draw(context){
        context.font = "bold 32px verdana";
        context.textAlign = "left";
        context.fillStyle = "white";
        context.fillText(this.game.playerCoins, this.x, this.y);
        context.fillStyle = "black";
        context.strokeText(this.game.playerCoins, this.x, this.y);
        context.drawImage(this.coinImage, this.coinX, this.coinY)
    }
    update(){

    }
}