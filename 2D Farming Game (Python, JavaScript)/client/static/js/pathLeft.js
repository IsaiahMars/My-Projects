import Player from "./player.js";
import InputHandler from "./inputHandler.js";
import Path from "./path.js";
import Inventory from "./inventory.js";
import InventoryItem from "./inventoryItem.js";
import TurnipPlot from "./turnipPlot.js";
import CarrotPlot from "./carrotPlot.js";
import CornPlot from "./cornPlot.js";
import LettucePlot from "./lettucePlot.js";
import PotatoPlot from "./potatoPlot.js";
import Message from "./message.js";
import Coins from "./coin.js";

window.addEventListener('load', function(){
    const canvas = document.getElementById('left-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1080;
    canvas.height = 720;

    let canvasPosition = canvas.getBoundingClientRect();
        window.addEventListener('resize', function(){
        canvasPosition = canvas.getBoundingClientRect();
    });
    window.addEventListener('scroll', function(){
        canvasPosition = canvas.getBoundingClientRect();
    });

    const mouse = {x: 0, y: 0};
    canvas.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX - canvasPosition.left;
        mouse.y = event.clientY - canvasPosition.top;
    })

    var plotX, plotY = 0;
    var lastHoveredPlot = undefined;
    var lastHoveredItem = undefined;
    canvas.addEventListener('click', (event) => {
        plotX = event.clientX - canvasPosition.left;
        plotY = event.clientY - canvasPosition.top;
        if(game.buildMode && game.buildPlot.placeable && game.currentPlots < game.maxPlots){
            game.plots.push(new Plot(plotX - 41, plotY - 41, 82, 82));
            game.currentPlots++;
        }
        else if(game.buildMode && game.currentPlots == game.maxPlots){
            game.messages.push(new Message(game, 540, 630, "PLOT LIMIT REACHED", "error"));
        }
        if(game.removeMode && game.removePlot.removeable && game.currentPlots > 0){
            game.plots.splice(lastHoveredPlot, 1);
            game.currentPlots--;
        }
        if(game.moveMode && game.currentPlots >= 0){
            if(game.movePlot.grabable && !game.movePlot.grabbed){
                game.plots.splice(lastHoveredPlot, 1);
                game.currentPlots--;
                game.movePlot.grabbed = true;
                game.moveButton.style.display = "none";
            }
            if(game.movePlot.grabbed && game.movePlot.placeable){
                game.plots.push(new Plot(plotX - 41, plotY - 41, 82, 82));
                game.currentPlots++;
                game.moveButton.style.display = "flex";
                game.movePlot.grabbed = false;
                game.movePlot.placeable = false;
            }
        }
        if(game.inventoryOpen){
            if(game.playerInventory.grabable && !game.playerInventory.grabbed){
                game.playerInventory.grabbedItem = game.inventoryArray.splice(lastHoveredItem, 1);
                for(let i = lastHoveredItem; i < game.inventoryArray.length; i++){
                    if(game.inventoryArray[i].column == 1 && game.inventoryArray[i].row == 2){
                        game.inventoryArray[i].row = 1;
                        game.inventoryArray[i].column = 4;
                    }
                    else{
                        game.inventoryArray[i].column--;
                    }
                }
                game.playerInventory.currentSlotsFilled--;
                game.playerInventory.grabbed = true;
            }
            if(game.playerInventory.grabbed && game.playerInventory.placeable){
                if(game.inventoryArray.length > 0){
                    game.inventoryArray.push(new InventoryItem(game.playerInventory.grabbedItem[0].name, game.playerInventory.grabbedItem[0].imageId, game.playerInventory.grabbedItem[0].count, game.inventoryArray[game.inventoryArray.length - 1].column + 1 == 5 ? 2 : game.inventoryArray[game.inventoryArray.length - 1].row, game.inventoryArray[game.inventoryArray.length - 1].column + 1 == 5 ? 1 : game.inventoryArray[game.inventoryArray.length - 1].column + 1));
                }
                else{
                    game.inventoryArray.push(new InventoryItem(game.playerInventory.grabbedItem[0].name, game.playerInventory.grabbedItem[0].imageId, game.playerInventory.grabbedItem[0].count, 1, 1));
                }
                game.playerInventory.currentSlotsFilled++;
                game.playerInventory.grabbed = false;
                game.playerInventory.placeable = false;
                game.playerInventory.grabbedItem = undefined;
            }
            else if(game.playerInventory.grabbed && game.playerInventory.grabbedItem[0].isSeed && game.playerInventory.grabbedItem[0].plantable){
                game.plots[lastHoveredPlot] = game.playerInventory.plantCrop(game.playerInventory.grabbedItem[0].name.slice(0,2), game.plots[lastHoveredPlot].x, game.plots[lastHoveredPlot].y);
                console.log(game.plots)
                game.playerInventory.grabbedItem[0].plantable = false;
                if(game.playerInventory.grabbedItem[0].count > 1){
                    game.playerInventory.grabbedItem[0].count--
                }
                else{
                    game.playerInventory.grabbed = false;
                    game.playerInventory.grabbedItem = undefined;
                }               
            }
        }
        if(game.harvestMode && game.harvestPlot.harvestable){
            var existsInInv = false;
            var inventoryIndex = 0;
            var harvestedItem = game.plots[lastHoveredPlot]
            game.inventoryArray.forEach((item, index) =>{
                if(harvestedItem.cropType == item.name){
                    existsInInv = true;
                    inventoryIndex = index;
                }
            });
            if(existsInInv == false && game.playerInventory.currentSlotsFilled < game.playerInventory.maxSlotsFilled){
                if(game.inventoryArray.length > 0){
                    game.inventoryArray.push(new InventoryItem(harvestedItem.cropType, harvestedItem.itemImageId, 1, game.inventoryArray[game.inventoryArray.length - 1].column + 1 == 5 ? 2 : game.inventoryArray[game.inventoryArray.length - 1].row, game.inventoryArray[game.inventoryArray.length - 1].column + 1 == 5 ? 1 : game.inventoryArray[game.inventoryArray.length - 1].column + 1));
                }
                else{
                    game.inventoryArray.push(new InventoryItem(harvestedItem.cropType, harvestedItem.itemImageId, 1, 1, 1));
                }
                game.playerInventory.currentSlotsFilled++;
                game.plots[lastHoveredPlot] = new Plot(game.plots[lastHoveredPlot].x, game.plots[lastHoveredPlot].y, 82, 82)
                game.harvestPlot.harvestable = false;
                game.messages.push(new Message(game, 540, 630, "1x " + harvestedItem.cropType.toUpperCase() + " HARVESTED", "success"));
            }
            else if(existsInInv){
                game.inventoryArray[inventoryIndex].count++;
                game.plots[lastHoveredPlot] = new Plot(game.plots[lastHoveredPlot].x, game.plots[lastHoveredPlot].y, 82, 82)
                game.harvestPlot.harvestable = false;
                game.messages.push(new Message(game, 540, 630, "1x " + harvestedItem.cropType.toUpperCase() + " HARVESTED", "success"));
            }
            else{
                game.messages.push(new Message(game, 540, 630, "NOT ENOUGH INVENTORY SPACE", "error"))
            }
        }
    })

    class BuildPlot{
        constructor(){
            this.image = document.getElementById('redHighlightedPlot')
            this.x = 0;
            this.y = 0;
            this.imageWidth = 82;
            this.imageHeight = 82;
            this.width = this.imageWidth;
            this.height = this.imageHeight;
            this.placeable = true;
        }

        draw(context){
            context.drawImage(this.image, mouse.x - 41, mouse.y - 41, this.width, this.height);
        }

        update(){
            this.x = mouse.x;
            this.y = mouse.y;
            if(this.placeable){
                this.image = document.getElementById('highlightedPlot');
            }
            else{
                this.image = document.getElementById('redHighlightedPlot');
            }
        }
    }

    class RemovePlot{
        constructor(){
            this.image = document.getElementById('removeMode')
            this.x = 0;
            this.y = 0;
            this.imageWidth = 75;
            this.imageHeight = 75;
            this.width = this.imageWidth;
            this.height = this.imageHeight;
            this.removeable = true;
        }

        draw(context){
            context.drawImage(this.image, mouse.x - 32, mouse.y - 32, this.width, this.height);
        }

        update(){
            this.x = mouse.x;
            this.y = mouse.y;
            if(this.removeable){
                this.image = document.getElementById('removeModeTilt');
            }
            else{
                this.image = document.getElementById('removeMode');
            }
        }
    }

    class MovePlot {
        constructor(){
            this.image = document.getElementById('moveMode')
            this.x = 0;
            this.y = 0;
            this.imageWidth = 82;
            this.imageHeight = 82;
            this.width = this.imageWidth;
            this.height = this.imageHeight;
            this.grabable = false;
            this.grabbed = false;
            this.placeable = false;
        }

        draw(context){
            context.drawImage(this.image, mouse.x - 41, mouse.y - 41, this.width, this.height);
        }

        update(){
            this.x = mouse.x;
            this.y = mouse.y;
            if(this.grabbed){
                this.grabable = false;
                if(this.placeable){
                    this.image = document.getElementById('grabbedPlot');
                }
                else{
                    this.image = document.getElementById('redGrabbedPlot');
                }
            }
            else{
                this.image = document.getElementById('moveMode');
            }
            
        }
    }

    class HarvestPlot {
        constructor(){
            this.image = document.getElementById('harvestMode')
            this.x = 0;
            this.y = 0;
            this.imageWidth = 82;
            this.imageHeight = 82;
            this.width = this.imageWidth;
            this.height = this.imageHeight;
            this.harvestable = false;
        }

        draw(context){
            context.drawImage(this.image, mouse.x - 41, mouse.y - 41, this.width, this.height);
        }
    }

    class Plot{
        constructor(x, y, imageWidth, imageHeight){
            this.x = x;
            this.y = y;
            this.image = document.getElementById('plot');
            this.imageWidth = imageWidth;
            this.imageHeight = imageHeight;
            this.width = this.imageWidth;
            this.height = this.imageHeight;
            this.timePlanted = 0;
            this.harvestable = false;
            this.cropType = "None";
        }

        draw(context){
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }

        update(){
        }
    }


    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.topMargin = 300;
            this.lastKey = undefined;
            this.input = new InputHandler(this);
            this.player = new Player(this, 980, 470);
            this.playerCoins = 0;
            this.coins = new Coins(this)
            this.playerInventory = new Inventory(this, canvas, mouse);
            this.inventoryArray = [];
            this.rightPath = new Path(50, 150, 1030, 470, 'leftPathRightBtn');
            this.saveButton = document.getElementById('saveBtn');
            this.buildButton = document.getElementById('buildBtn');
            this.buildButton.onclick = this.toggleBuildMode;
            this.removeButton = document.getElementById('removeBtn');
            this.removeButton.onclick = this.toggleRemoveMode;
            this.moveButton = document.getElementById('moveBtn');
            this.moveButton.onclick = this.toggleMoveMode;
            this.inventoryButton = document.getElementById('inventoryBtn');
            this.harvestButton = document.getElementById('harvestBtn');
            this.harvestButton.onclick = this.toggleHarvestMode;
            this.inventoryButton.onclick = this.toggleInventory;
            this.inventoryOpen = false;
            this.buildMode = false;
            this.removeMode = false;
            this.moveMode = false;
            this.harvestMode = false;
            this.buildPlot = new BuildPlot();
            this.removePlot = new RemovePlot();
            this.movePlot = new MovePlot();
            this.harvestPlot = new HarvestPlot();
            this.plots = [new Plot(0,0,0,0)];
            this.maxPlots = 5;
            this.currentPlots = 0;
            this.gameObjects = [this.player, this.rightPath, this.coins];
            this.messages = [];
        }

        toggleBuildMode = ()=>{
            if(this.removeMode || this.harvestMode){
                this.removeMode = false;
                this.harvestMode = false;
            }
            this.buildMode = !this.buildMode;
            if(this.buildMode){
                canvas.style.cursor = "none";
                this.inventoryButton.style.display = "none";
                this.saveButton.style.display = "none";
            }
            else{
                canvas.style.cursor = "default"
                this.inventoryButton.style.display = "flex";
                this.saveButton.style.display = "flex";
            }
        }

        toggleRemoveMode = ()=>{
            if(this.buildMode || this.harvestMode){
                this.buildMode = false;
                this.harvestMode = false;
            }
            this.removeMode = !this.removeMode;
            if(this.removeMode){
                canvas.style.cursor = "none";
                this.inventoryButton.style.display = "none";
                this.saveButton.style.display = "none";
            }
            else{
                canvas.style.cursor = "default"
                this.inventoryButton.style.display = "flex";
                this.saveButton.style.display = "flex";
            }
        }

        toggleMoveMode = ()=>{
            if(this.buildMode || this.removeMode || this.harvestMode){
                this.buildMode = false;
                this.removeMode = false;
                this.harvestMode = false;
            }
            this.moveMode = !this.moveMode;
            if(this.moveMode){
                canvas.style.cursor = "none";
                this.removeButton.style.display = "none";
                this.buildButton.style.display = "none";
                this.inventoryButton.style.display = "none";
                this.saveButton.style.display = "none";
                this.harvestButton.style.display = "none";
            }
            else{
                canvas.style.cursor = "default"
                this.removeButton.style.display = "flex";
                this.buildButton.style.display = "flex";
                this.inventoryButton.style.display = "flex";
                this.saveButton.style.display = "flex";
                this.harvestButton.style.display = "flex";
            }
        }

        toggleInventory = ()=>{
            this.inventoryOpen = !this.inventoryOpen
            if(this.inventoryOpen){
                this.buildButton.style.display = "none";
                this.removeButton.style.display = "none";
                this.moveButton.style.display = "none";
                this.saveButton.style.display = "none";
                this.harvestButton.style.display = "none";

            }
            else{
                this.buildButton.style.display = "flex";
                this.removeButton.style.display = "flex";
                this.moveButton.style.display = "flex";
                this.saveButton.style.display = "flex";
                this.harvestButton.style.display = "flex";
            }
        }

        toggleHarvestMode = ()=>{
            if(this.buildMode || this.removeMode){
                this.buildMode = false;
                this.removeMode = false;
            }
            this.harvestMode = !this.harvestMode
            if(this.harvestMode){
                canvas.style.cursor = "none";
                this.inventoryButton.style.display = "none";
                this.saveButton.style.display = "none";
            }
            else{
                canvas.style.cursor = "default";
                this.inventoryButton.style.display = "flex";
                this.saveButton.style.display = "flex";
            }
            
        }

        render = (context, deltaTime)=>{
            if(this.player.x > this.rightPath.x + this.rightPath.width ||
               this.player.x + this.player.width < this.rightPath.x ||
               this.player.y > this.rightPath.y + this.rightPath.height ||
               this.player.y + this.player.height < this.rightPath.y){
                this.rightPath.button.style.display = "none";
            }
            else{
                this.rightPath.button.style.display = "flex";
            }

            if(this.buildMode){
                this.rightPath.button.style.display = "none";
                let numPlots = 0;
                this.plots.forEach((plot) =>{
                    plot.draw(context);
                    plot.update();
                    if((mouse.x > 50 && mouse.x < this.width - 350 && mouse.y < this.height - 50 && mouse.y > this.topMargin + 110) &&
                       (this.currentPlots < this.maxPlots) && 
                       (this.buildPlot.x - 35 > plot.x + plot.width ||
                        this.buildPlot.x + this.buildPlot.width < plot.x + 50||
                        this.buildPlot.y - 35 > plot.y + plot.height ||
                        this.buildPlot.y + this.buildPlot.height < plot.y + 50)){
                            numPlots++;
                            if(numPlots == this.plots.length){
                                setTimeout(() =>{
                                    this.buildPlot.placeable = true;
                                }, 0)
                            }
                    }
                    else{
                        this.buildPlot.placeable = false;
                    }
                });

                this.buildPlot.draw(context);
                this.buildPlot.update()
            }
            else if(this.removeMode){
                this.rightPath.button.style.display = "none";
                let numPlots = 0;
                this.plots.forEach((plot, index) =>{
                    plot.draw(context);
                    plot.update();
                    if((this.currentPlots > 0) && 
                       (this.removePlot.x < plot.x + plot.width &&
                        this.removePlot.x + this.removePlot.width - 60 > plot.x &&
                        this.removePlot.y < plot.y + plot.height &&
                        this.removePlot.y + this.removePlot.height > plot.y)){
                            numPlots++;
                            lastHoveredPlot = index;
                        };
                });
                if(numPlots == 1){
                    this.removePlot.removeable = true;
                }
                else{
                    this.removePlot.removeable = false;
                };
                
                this.removePlot.draw(context);
                this.removePlot.update()
            }
            else if(this.moveMode){
                this.rightPath.button.style.display = "none";
                if(this.movePlot.grabbed){
                    let numPlots = 0;
                    this.plots.forEach((plot) =>{
                        plot.draw(context);
                        plot.update();
                        if((mouse.x > 50 && mouse.x < this.width - 350 && mouse.y < this.height - 50 && mouse.y > this.topMargin + 110) &&
                        (this.currentPlots < this.maxPlots) && 
                        (this.movePlot.x - 35 > plot.x + plot.width ||
                            this.movePlot.x + this.movePlot.width < plot.x + 50||
                            this.movePlot.y - 35 > plot.y + plot.height ||
                            this.movePlot.y + this.movePlot.height < plot.y + 50)){
                                numPlots++;
                                if(numPlots == this.plots.length){
                                    setTimeout(() =>{
                                        this.movePlot.placeable = true;
                                    }, 0)
                                }
                        }
                        else{
                            this.movePlot.placeable = false;
                        }
                    });
                }
                else{
                    let numPlots = 0;
                    this.plots.forEach((plot, index) =>{
                        plot.draw(context);
                        plot.update();
                        if((this.currentPlots > 0) && 
                           (this.movePlot.x < plot.x + plot.width &&
                            this.movePlot.x + this.movePlot.width - 65 > plot.x &&
                            this.movePlot.y - 10 < plot.y + plot.height &&
                            this.movePlot.y + this.movePlot.height - 65 > plot.y)){
                                numPlots++;
                                lastHoveredPlot = index;
                            };
                    });
                    if(numPlots == 1){
                        this.movePlot.grabable = true;
                    }
                    else{
                        this.movePlot.grabable = false;
                    };
                };
                
                this.movePlot.draw(context);
                this.movePlot.update()
            }
            else if(this.inventoryOpen){
                var numPlots = 0;
                this.plots.forEach((plot, index) =>{
                    plot.draw(context);
                    plot.update();
                    if(this.playerInventory.grabbed){
                       if(plot.cropType == "None" &&
                          mouse.x > plot.x && mouse.x < plot.x + plot.width && mouse.y < plot.y + plot.height && mouse.y > plot.y){
                            numPlots++;
                            lastHoveredPlot = index;
                       }
                    }
                });
                if(this.playerInventory.grabbed && numPlots == 1){
                    this.playerInventory.grabbedItem[0].plantable = true;
                }
                else if(this.playerInventory.grabbed){
                    this.playerInventory.grabbedItem[0].plantable = false;
                }

                this.playerInventory.draw(context);
                this.rightPath.button.style.display = "none";
                if(this.playerInventory.grabbed){
                    this.inventoryArray.forEach((item) =>{
                        item.draw(context);
                    });
                    if((mouse.x > 303 && mouse.x < 303 + this.playerInventory.width && mouse.y < 80 + this.playerInventory.height && mouse.y > 80) &&
                       (this.playerInventory.currentSlotsFilled < this.playerInventory.maxSlotsFilled)){  
                            setTimeout(() =>{
                                this.playerInventory.placeable = true;
                            }, 0)
                        }
                    else{
                        this.playerInventory.placeable = false;
                    }
                }
                else{
                    let numItems = 0;
                    this.inventoryArray.forEach((item, index) =>{
                        item.draw(context);
                        if(mouse.x < 227 + (113 * item.column) + item.width &&
                            mouse.x > 227 + (113 * item.column) &&
                            mouse.y < (120 * item.row) + item.height &&
                            mouse.y > (120 * item.row)){
                                numItems++;
                                lastHoveredItem = index;
                            };
                    });
                    if(lastHoveredItem != undefined){
                        if(numItems == 1){
                            this.playerInventory.grabable = true;
                        }
                        else{
                            this.playerInventory.grabable = false;
                        };
                    };
                }
                this.playerInventory.drawGrabbedItem(context);
                
            }
            else if(this.harvestMode){
                this.rightPath.button.style.display = "none";
                let numPlots = 0;
                this.plots.forEach((plot, index) =>{
                    plot.draw(context);
                    plot.update();
                    if((plot.harvestable) &&
                        (mouse.x < plot.x + plot.width &&
                        mouse.x > plot.x &&
                        mouse.y < plot.y + plot.height &&
                        mouse.y > plot.y)){
                            numPlots++;
                            lastHoveredPlot = index;
                        };
                });
                if(numPlots == 1){
                    this.harvestPlot.harvestable = true;
                    console.log(this.harvestPlot.harvestable)
                }
                else{
                    this.harvestPlot.harvestable = false;
                    console.log(this.harvestPlot.harvestable)
                };
                this.harvestPlot.draw(context);
            }
            else{
                this.plots.forEach((plot) =>{
                    plot.draw(context);
                    plot.update();
                });
                
            }

            this.gameObjects.forEach(object => {
                object.draw(context);
                object.update(deltaTime);
            });
            this.messages.forEach(message => {
                message.draw(context);
                message.update();
            });
        }  
    }

    
    const game = new Game(canvas.width, canvas.height);

    var socket = io.connect("http://127.0.0.1:1738");

    socket.on('connect', function() {
        socket.emit('lp_request_user_info');
    });

    socket.on('lp_retrieved_user_info', function(data) {
        let userInfoDict = JSON.parse(data);
        userInfoDict["plots"].forEach((plot) =>{
            if(plot["crop_type"] == "Turnip"){
                game.plots.push(new TurnipPlot(plot["x"], plot["y"], plot["time_planted"]));
            }
            else if(plot["crop_type"] == "Carrot"){
                game.plots.push(new CarrotPlot(plot["x"], plot["y"], plot["time_planted"]));
            }
            else if(plot["crop_type"] == "Corn"){
                game.plots.push(new CornPlot(plot["x"], plot["y"], plot["time_planted"]));
            }
            else if(plot["crop_type"] == "Lettuce"){
                game.plots.push(new LettucePlot(plot["x"], plot["y"], plot["time_planted"]));
            }
            else if(plot["crop_type"] == "Potato"){
                game.plots.push(new PotatoPlot(plot["x"], plot["y"], plot["time_planted"]));
            }
            else{
                game.plots.push(new Plot(plot["x"], plot["y"], 82, 82));
            }
            game.currentPlots++;
        });
        userInfoDict["inventory"].forEach((item) => {
            game.inventoryArray.push(new InventoryItem(item["item_name"], item["item_image_id"], item["item_count"], item["item_row"], item["item_column"]));
            game.playerInventory.currentSlotsFilled++;
        })
        game.playerCoins = userInfoDict["coins"];
    });

    $('#saveBtn').on("click", function() {                         
        let playerPlots = game.plots.slice(1);
        let savedPlots = [];
        let savedInv = [];
        
        game.inventoryArray.forEach((item) => {
            savedInv.push({"item_name": item.name, "item_count":item.count, "item_image_id":item.imageId, "item_row":item.row, "item_column":item.column})
        })
        playerPlots.forEach((plot) => {
            savedPlots.push({"x": plot.x, "y": plot.y, "time_planted": plot.timePlanted, "crop_type": plot.cropType})
        });
        socket.emit('lp_save_user_info', JSON.stringify({"plots":savedPlots, "inventory":savedInv, "coins":game.playerCoins}));
        console.log(JSON.stringify({"plots":savedPlots, "inventory":savedInv}));
    });

    $('#leftPathRightBtn').on("click", function() {
        let playerPlots = game.plots.slice(1);
        let savedPlots = [];
        let savedInv = [];
        
        game.inventoryArray.forEach((item) => {
            savedInv.push({"item_name": item.name, "item_count":item.count, "item_image_id":item.imageId, "item_row":item.row, "item_column":item.column})
        })
        playerPlots.forEach((plot) => {
            savedPlots.push({"x": plot.x, "y": plot.y, "time_planted": plot.timePlanted, "crop_type": plot.cropType})
        });
        socket.emit('lp_save_user_info', JSON.stringify({"plots":savedPlots, "inventory":savedInv, "coins":game.playerCoins}));
        console.log(JSON.stringify({"plots":savedPlots, "inventory":savedInv}));
    });

    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx, deltaTime);
        requestAnimationFrame(animate);
    }

    animate(0);
});