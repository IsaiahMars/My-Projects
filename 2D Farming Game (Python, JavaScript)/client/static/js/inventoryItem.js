export default class InventoryItem{
    constructor(name, imageId, count, row, column){
        this.name = name;
        if(this.name.slice(-5) == "Seeds"){
            this.isSeed = true;
        }
        else{
            this.isSeed = false;
        }
        this.plantable = false;
        this.count = count;
        this.imageId = imageId;
        this.image = document.getElementById(imageId);
        this.row = row;
        this.column = column;
        this.width = 64;
        this.height = 72;
    }

    draw(context){
        context.font = '28px arial';
        context.fillStyle = "white";
        context.textAlign = "right";
        context.drawImage(this.image, 227 + (113 * this.column), (120 * this.row), this.width, this.height);
        context.fillText(this.count, 295 + (113 * this.column), 70 + (120 * this.row));
        context.fillStyle = "black";
        context.strokeText(this.count, 295 + (113 * this.column), 70 + (120 * this.row));
    }

    update(){
    }
}