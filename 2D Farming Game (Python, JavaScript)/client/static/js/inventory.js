import TurnipPlot from "./turnipPlot.js";
import CarrotPlot from "./carrotPlot.js";
import CornPlot from "./cornPlot.js";
import LettucePlot from "./lettucePlot.js";
import PotatoPlot from "./potatoPlot.js";

export default class Inventory{
    constructor(game, canvas, mouse){
        this.game = game;
        this.canvas = canvas;
        this.mouse = mouse;
        this.maxSlotsFilled = 8;
        this.currentSlotsFilled = 0;
        this.image = document.getElementById('inventoryBg')
        this.width = 475;
        this.height = 270;
        this.grabable = false;
        this.grabbed = false;
        this.grabbedItem = undefined;
        this.placeable = false;
    }

    draw(context){
        context.drawImage(this.image, 303, 80, this.width, this.height);
    }

    drawGrabbedItem(context){
        if(this.grabbed){
            this.canvas.style.cursor = "none";
            context.drawImage(this.grabbedItem[0].image, this.mouse.x - 32, this.mouse.y - 36, this.grabbedItem[0].width, this.grabbedItem[0].height);
            context.font = '28px arial';
            context.fillStyle = "white";
            context.textAlign = "right";
            context.fillText(this.grabbedItem[0].count, this.mouse.x + 35, this.mouse.y + 36);
            context.fillStyle = "black";
            context.strokeText(this.grabbedItem[0].count, this.mouse.x + 35, this.mouse.y + 36);
        }
        else{
            this.canvas.style.cursor = "default";
        }
    }

    plantCrop(cropType, x, y){
        if(cropType == "Tu"){
            return new TurnipPlot(x, y, Date.now())
        }
        else if(cropType == "Ca"){
            return new CarrotPlot(x, y, Date.now())
        }
        else if(cropType == "Co"){
            return new CornPlot(x, y, Date.now())
        }
        else if(cropType == "Le"){
            return new LettucePlot(x, y, Date.now())
        }
        else if(cropType == "Po"){
            return new PotatoPlot(x, y, Date.now())
        }
    }

    update(){
    }
}