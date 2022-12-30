export default class LettucePlot{
    constructor(x, y, timePlanted){
        this.x = x;
        this.y = y;
        this.plotImage = document.getElementById('plot');
        this.cropImage = document.getElementById('lettuceSpritesheet');
        this.itemImageId = "lettuceItem";
        this.imageWidth = 82;
        this.imageHeight = 82;
        this.width = this.imageWidth;
        this.height = this.imageHeight;
        this.frameX = 0;
        this.stage = 1;
        this.timePlanted = timePlanted;
        this.harvestable = false;
        this.cropType = "Lettuce";
    }

    draw(context){
        context.drawImage(this.plotImage, this.x, this.y, this.width, this.height);
        context.drawImage(this.cropImage, this.frameX * 35, 0, 35, 33, this.x + 25, this.y + 25, 35, 33);
    }

    update(){
        var now = Date.now();
        if(this.stage < 6){
            if(this.timePlanted + (4000 * this.stage) < now){
                this.frameX += 1;
                this.stage += 1;
            }
        }
        else{
            this.harvestable = true;
        }
        
    }
}