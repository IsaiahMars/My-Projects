import Player from "./player.js";
import InputHandler from "./inputHandler.js";
import Path from "./path.js";
import Inventory from "./inventory.js";
import InventoryItem from "./inventoryItem.js";
import Message from "./message.js";
import Coins from "./coin.js";


window.addEventListener('load', function(){
    const canvas = document.getElementById('right-canvas');
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

    var lastHoveredItem = undefined;
    canvas.addEventListener('click', () => {
        if(game.market.hovered && !game.marketMenuOpen){
            game.toggleMarketMenu();
        }
        else if(game.marketMenuOpen){
            game.marketMenuOpen = false;
            game.marketMenu.style.display = "none";
            game.saveButton.style.display = "flex";
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
            };
            if(game.playerInventory.grabbed && game.playerInventory.placeable){
                if(game.inventoryArray.length > 0){
                    game.inventoryArray.push(new InventoryItem(game.playerInventory.grabbedItem[0].name, game.playerInventory.grabbedItem[0].imageId, game.playerInventory.grabbedItem[0].count, 
                    game.inventoryArray[game.inventoryArray.length - 1].column + 1 == 5 ? 2 : game.inventoryArray[game.inventoryArray.length - 1].row, 
                    game.inventoryArray[game.inventoryArray.length - 1].column + 1 == 5 ? 1 : game.inventoryArray[game.inventoryArray.length - 1].column + 1))
                }
                else{
                    game.inventoryArray.push(new InventoryItem(game.playerInventory.grabbedItem[0].name, game.playerInventory.grabbedItem[0].imageId, game.playerInventory.grabbedItem[0].count, 1, 1))
                }
                game.playerInventory.currentSlotsFilled++;
                game.playerInventory.grabbed = false;
                game.playerInventory.placeable = false;
                game.playerInventory.grabbedItem = undefined;
            };
        };
    });

    class Market {
        constructor(){
            this.x = 500;
            this.y = 120;
            this.frameX = 0;
            this.maxFrame = 2;
            this.counter = 0;
            this.spriteWidth = 480;
            this.spriteHeight = 380;
            this.width = this.spriteWidth;
            this.height = this.spriteHeight;
            this.image = document.getElementById('market')
            this.hoverImage = document.getElementById('marketHover')
            this.turnipSeedCount = document.getElementById('turnipSeedCount');
            this.carrotSeedCount = document.getElementById('carrotSeedCount');
            this.cornSeedCount = document.getElementById('cornSeedCount');
            this.lettuceSeedCount = document.getElementById('lettuceSeedCount');
            this.potatoSeedCount = document.getElementById('potatoSeedCount');
            this.turnipItemCount = document.getElementById('turnipItemCount');
            this.carrotItemCount = document.getElementById('carrotItemCount');
            this.cornItemCount = document.getElementById('cornItemCount');
            this.lettuceItemCount = document.getElementById('lettuceItemCount');
            this.potatoItemCount = document.getElementById('potatoItemCount');
            this.hovered = false; 
        }

        draw(context){
            if(this.hovered && !game.inventoryOpen){
                context.drawImage(this.hoverImage, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);   
            }
            else{
                context.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
            
        }

        update(){
            if(this.hovered && !game.inventoryOpen){
                canvas.style.cursor = "pointer";
                this.counter++;
                if(this.counter % 15 == 0 && this.frameX < this.maxFrame){
                    this.frameX++;
                }
            }
            else{
                canvas.style.cursor = "default";
                this.counter = 0;
                this.frameX = 0;
            }
        }
    }

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.topMargin = 300;
            this.lastKey = undefined;
            this.input = new InputHandler(this);
            this.player = new Player(this, 0, 540);
            this.playerInventory = new Inventory(this, canvas, mouse);
            this.playerCoins = 0;
            this.coins = new Coins(this)
            this.inventoryOpen = false;
            this.market = new Market();
            this.marketMenu = document.getElementById('marketMenu');
            this.marketMenuOpen = false;
            this.marketMenuLeftTotal = document.getElementById('marketMenuLeftTotal');
            this.marketMenuRightTotal = document.getElementById('marketMenuRightTotal');
            this.buySeedBtn = document.getElementById('buySeedBtn');
            this.sellCropBtn = document.getElementById('sellCropBtn');
            this.buySeedBtn.onclick = this.buySeeds;
            this.sellCropBtn.onclick = this.sellCrops;
            this.leftPath = new Path(50, 150, 0, 470, 'rightPathLeftBtn');
            this.saveButton = document.getElementById('saveBtn');
            this.inventoryButton = document.getElementById('inventoryBtn');
            this.inventoryButton.onclick = this.toggleInventory;
            this.gameObjects = [this.market, this.player, this.leftPath, this.coins];
            this.messages = [];
            this.inventoryArray = [];
        };

        toggleInventory = ()=>{
            this.inventoryOpen = !this.inventoryOpen
            if(this.inventoryOpen){
                this.saveButton.style.display = "none";
            }
            else{
                this.saveButton.style.display = "flex";
            }
        };

        toggleMarketMenu = () =>{
            this.marketMenuOpen = !this.marketMenuOpen;
            if(this.marketMenuOpen){
                this.marketMenu.style.display = "flex";
                this.saveButton.style.display = "none";
                this.inventoryOpen = false;
            }
            else{
                this.marketMenu.style.display = "none";
                this.saveButton.style.display = "flex";
            }
        }

        buySeeds = () =>{
            let purchasedItemCount = 0;
            let newItemCount = 0;
            let cost = 0;
            let purchasedItems = {"Turnip Seeds": [parseInt(turnipSeedCount.value), false, 0], 
                                  "Carrot Seeds": [parseInt(carrotSeedCount.value), false, 0], 
                                  "Corn Seeds": [parseInt(cornSeedCount.value), false, 0], 
                                  "Lettuce Seeds": [parseInt(lettuceSeedCount.value), false, 0], 
                                  "Potato Seeds": [parseInt(potatoSeedCount.value), false, 0]};
            this.inventoryArray.forEach((item, index) => {
                if(purchasedItems[item.name] != undefined){
                    purchasedItems[item.name][1] = true;
                    purchasedItems[item.name][2] = index;
                };
            });
            for (const [key, value] of Object.entries(purchasedItems)){
                if(value[0] > 0){
                    purchasedItemCount++;
                    if(key == "Turnip Seeds"){
                        cost += 10 * value[0]
                    }
                    else if(key == "Lettuce Seeds"){
                        cost += 35 * value[0]
                    }
                    else if(key == "Carrot Seeds"){
                        cost += 65 * value[0]
                    }
                    else if(key == "Corn Seeds"){
                        cost += 90 * value[0]
                    }
                    else if(key == "Potato Seeds"){
                        cost += 100 * value[0]
                    }
                    if(!value[1]){
                        newItemCount++;
                    }
                }
            }
            if(purchasedItemCount > 0){
                if(cost <= this.playerCoins){
                    if(newItemCount <= this.playerInventory.maxSlotsFilled - this.playerInventory.currentSlotsFilled){
                        for (const [key, value] of Object.entries(purchasedItems)){
                            if(value[0] > 0){
                                this.playerInventory.currentSlotsFilled++;
                                if(key == "Turnip Seeds"){
                                    if(value[1]){
                                        this.inventoryArray[value[2]].count += value[0];
                                    }
                                    else{
                                        if(this.inventoryArray.length > 0){
                                            this.inventoryArray.push(new InventoryItem(key, "turnipSeeds", value[0], this.inventoryArray[this.inventoryArray.length - 1].column + 1 == 5 ? 2 : this.inventoryArray[this.inventoryArray.length - 1].row, this.inventoryArray[this.inventoryArray.length - 1].column + 1 == 5 ? 1 : this.inventoryArray[this.inventoryArray.length - 1].column + 1));
                                        }
                                        else{
                                            this.inventoryArray.push(new InventoryItem(key, "turnipSeeds", value[0], 1, 1));
                                        }
                                    }
                                    this.market.turnipSeedCount.value = 0;
                                }
                                else if(key == "Carrot Seeds"){
                                    if(value[1]){
                                        this.inventoryArray[value[2]].count += parseInt(value[0]);
                                    }
                                    else{
                                        if(this.inventoryArray.length > 0){
                                            this.inventoryArray.push(new InventoryItem(key, "carrotSeeds", value[0], this.inventoryArray[this.inventoryArray.length - 1].column + 1 == 5 ? 2 : this.inventoryArray[this.inventoryArray.length - 1].row, this.inventoryArray[this.inventoryArray.length - 1].column + 1 == 5 ? 1 : this.inventoryArray[this.inventoryArray.length - 1].column + 1));
                                        }
                                        else{
                                            this.inventoryArray.push(new InventoryItem(key, "carrotSeeds", value[0], 1, 1));
                                        }
                                    }
                                    this.market.carrotSeedCount.value = 0;
                                }
                                else if(key == "Corn Seeds"){
                                    if(value[1]){
                                        this.inventoryArray[value[2]].count += parseInt(value[0]);
                                    }
                                    else{
                                        if(this.inventoryArray.length > 0){
                                            this.inventoryArray.push(new InventoryItem(key, "cornSeeds", value[0], this.inventoryArray[this.inventoryArray.length - 1].column + 1 == 5 ? 2 : this.inventoryArray[this.inventoryArray.length - 1].row, this.inventoryArray[this.inventoryArray.length - 1].column + 1 == 5 ? 1 : this.inventoryArray[this.inventoryArray.length - 1].column + 1));
                                        }
                                        else{
                                            this.inventoryArray.push(new InventoryItem(key, "cornSeeds", value[0], 1, 1));
                                        }
                                    }
                                    this.market.cornSeedCount.value = 0;
                                }
                                else if(key == "Lettuce Seeds"){
                                    if(value[1]){
                                        this.inventoryArray[value[2]].count += parseInt(value[0]);
                                    }
                                    else{
                                        if(this.inventoryArray.length > 0){
                                            this.inventoryArray.push(new InventoryItem(key, "lettuceSeeds", value[0], this.inventoryArray[this.inventoryArray.length - 1].column + 1 == 5 ? 2 : this.inventoryArray[this.inventoryArray.length - 1].row, this.inventoryArray[this.inventoryArray.length - 1].column + 1 == 5 ? 1 : this.inventoryArray[this.inventoryArray.length - 1].column + 1));
                                        }
                                        else{
                                            this.inventoryArray.push(new InventoryItem(key, "lettuceSeeds", value[0], 1, 1));
                                        }
                                    }
                                    this.market.lettuceSeedCount.value = 0;
                                }
                                else if(key == "Potato Seeds"){
                                    if(value[1]){
                                        this.inventoryArray[value[2]].count += parseInt(value[0]);
                                    }
                                    else{
                                        if(this.inventoryArray.length > 0){
                                            this.inventoryArray.push(new InventoryItem(key, "potatoSeeds", value[0], this.inventoryArray[this.inventoryArray.length - 1].column + 1 == 5 ? 2 : this.inventoryArray[this.inventoryArray.length - 1].row, this.inventoryArray[this.inventoryArray.length - 1].column + 1 == 5 ? 1 : this.inventoryArray[this.inventoryArray.length - 1].column + 1));
                                        }
                                        else{
                                            this.inventoryArray.push(new InventoryItem(key, "potatoSeeds", value[0], 1, 1));
                                        }
                                    }
                                    this.market.potatoSeedCount.value = 0;
                                };
                            };
                            
                        };
                        this.playerCoins -= cost;
                        this.marketMenuRightTotal.innerHTML = 0;
                        this.marketMenuRightTotal.style.color = "white";
                        this.messages.push(new Message(this, 540, 630, "PURCHASE SUCCESSFUL", "success"));
                    }
                    else{
                        this.messages.push(new Message(this, 540, 630, "NOT ENOUGH INVENTORY SPACE", "error"));
                    } 
                }
                else{
                    this.messages.push(new Message(this, 540, 630, "INSUFFICIENT FUNDS", "error"));
                }
            };
        };

        sellCrops = () => {
            let sale = 0;
            let soldItemCount = 0;
            let soldItems = {"Turnip": [parseInt(turnipItemCount.value), false, 0], 
                                  "Carrot": [parseInt(carrotItemCount.value), false, 0], 
                                  "Corn": [parseInt(cornItemCount.value), false, 0], 
                                  "Lettuce": [parseInt(lettuceItemCount.value), false, 0], 
                                  "Potato": [parseInt(potatoItemCount.value), false, 0]};
            
            this.inventoryArray.forEach((item, index) => {
                if(soldItems[item.name] != undefined){
                    soldItems[item.name][1] = true;
                    soldItems[item.name][2] = index;
                };
            });
            for (const [key, value] of Object.entries(soldItems)){
                if(value[0] > 0){
                    soldItemCount++;
                    if(key == "Turnip"){
                        sale += 15 * value[0]
                    }
                    else if(key == "Lettuce"){
                        sale += 50 * value[0]
                    }
                    else if(key == "Carrot"){
                        sale += 85 * value[0]
                    }
                    else if(key == "Corn"){
                        sale += 120 * value[0]
                    }
                    else if(key == "Potato"){
                        sale += 135 * value[0]
                    }
                }
            }
            if(soldItemCount > 0){
                for (const [key, value] of Object.entries(soldItems)){
                    if(value[0] > 0){
                        if(key == "Turnip" || key == "Lettuce" || key == "Carrot" || key == "Corn" || key == "Potato"){    
                            if(value[1]){
                                let inventoryItemCount = this.inventoryArray[value[2]].count - value[0];
                                if(inventoryItemCount <= 0){
                                    document.getElementById('market' + key).style.visibility = "hidden";
                                    soldItems[key][1] = false;
                                    this.inventoryArray.splice(value[2], 1);
                                    for(let i = value[2]; i < this.inventoryArray.length; i++){
                                        if(this.inventoryArray[i].column == 1 && this.inventoryArray[i].row == 2){
                                            this.inventoryArray[i].row = 1;
                                            this.inventoryArray[i].column = 4;
                                        }
                                        else{
                                            this.inventoryArray[i].column--;
                                        }
                                    }
                                    for (const [key1, value1] of Object.entries(soldItems)){
                                        if(value[2] < value1[2]){
                                            value1[2]--;
                                        }
                                    }
                                    this.playerInventory.currentSlotsFilled--;
                                }
                                else{
                                    document.getElementById('' + key.toLowerCase() + 'ItemCount').max = "" + inventoryItemCount + "";
                                    this.inventoryArray[value[2]].count = inventoryItemCount;
                                }
                                document.getElementById('' + key.toLowerCase() + 'ItemCount').value = 0;
                            }     
                        }
                    };  
                };
                this.playerCoins += sale;
                this.marketMenuLeftTotal.innerHTML = 0;
                this.marketMenuLeftTotal.style.color = "white";
                this.messages.push(new Message(this, 540, 630, "SALE SUCCESSFUL", "success"));
            }
        }

        render = (context, deltaTime)=>{
            
            if(this.player.x > this.leftPath.x + this.leftPath.width ||
               this.player.x + this.player.width < this.leftPath.x ||
               this.player.y > this.leftPath.y + this.leftPath.height ||
               this.player.y + this.player.height < this.leftPath.y || 
               this.marketMenuOpen){
                this.leftPath.button.style.display = "none";
            }
            else{
                this.leftPath.button.style.display = "flex";
            }

            if(mouse.x > this.market.x + this.market.width ||
                mouse.x < this.market.x ||
                mouse.y > this.market.y + this.market.height ||
                mouse.y < this.market.y){
                this.market.hovered = false;
            }
            else{
                this.market.hovered = true;
            }

            if(this.player.y < this.market.y + this.market.height - 120 && this.player.x > this.market.x - 40 && this.player.x < this.market.x + this.market.width - 50){
                this.player.y = this.market.y + this.market.height - 120;
            }
            else if(this.player.x > this.market.x - 50 && this.player.x < this.market.x + this.market.width - 50 && this.player.y < this.market.y + this.market.height - 120){
                this.player.x = this.market.x - 50;
            }
            else if(this.player.x < this.market.x + this.market.width - 45 && this.player.x > this.market.x - 50 && this.player.y < this.market.y + this.market.height - 120){
                this.player.x = this.market.x + this.market.width - 45
            }


            if(this.inventoryOpen){
                this.market.hovered = false;
                this.gameObjects.forEach(object => {
                    object.draw(context);
                    object.update(deltaTime);
                });
                this.messages.forEach(message => {
                    message.draw(context);
                    message.update();
                });
                this.playerInventory.draw(context);
                this.leftPath.button.style.display = "none";
                this.marketMenuOpen = false;
                this.marketMenu.style.display = "none"
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
            else{
                this.gameObjects.forEach(object => {
                    object.draw(context);
                    object.update(deltaTime);
                }); 
                this.messages.forEach(message => {
                    message.draw(context);
                    message.update();
                });
            }
        }; 
    };

    const game = new Game(canvas.width, canvas.height);

    var socket = io.connect("http://127.0.0.1:1738");

    socket.on('connect', function() {
        socket.emit('rp_request_user_info');
    });

    socket.on('rp_retrieved_user_info', function(data) {
        let userInfoDict = JSON.parse(data);
        userInfoDict["inventory"].forEach((item) => {
            game.inventoryArray.push(new InventoryItem(item["item_name"], item["item_image_id"], item["item_count"], item["item_row"], item["item_column"]));
            let lastInvItem = game.inventoryArray[game.inventoryArray.length - 1];
            if(lastInvItem.name == "Turnip" ||
               lastInvItem.name == "Lettuce" ||
               lastInvItem.name == "Carrot" || 
               lastInvItem.name == "Corn" || 
               lastInvItem.name == "Potato"){
                document.getElementById('market' + lastInvItem.name + '').style.visibility = "visible";
                document.getElementById('' + lastInvItem.name.toLowerCase() + 'ItemCount').max = "" + lastInvItem.count + "";
            }
            
            game.playerInventory.currentSlotsFilled++;
        });
        game.playerCoins = userInfoDict["coins"];
        console.log('-- inventory --');
        console.log(game.inventoryArray)
        console.log('-- inventory --');
        console.log('-- coins --');
        console.log(game.playerCoins)
        console.log('-- coins --')
        
    })

    $('#saveBtn').on("click", function() {                          
        let savedInv = [];
        
        game.inventoryArray.forEach((item) => {
            savedInv.push({"item_name": item.name, "item_count":item.count, "item_image_id":item.imageId, "item_row":item.row, "item_column":item.column});
        });
        socket.emit('rp_save_user_info', JSON.stringify({"inventory":savedInv, "coins":game.playerCoins}));
        console.log(savedInv);
        console.log(game.playerCoins);
    });

    $('#rightPathLeftBtn').on("click", function() {
        let savedInv = [];
        game.inventoryArray.forEach((item) => {
            savedInv.push({"item_name": item.name, "item_count":item.count, "item_image_id":item.imageId, "item_row":item.row, "item_column":item.column});
        });
        socket.emit('rp_save_user_info', JSON.stringify({"inventory":savedInv, "coins":game.playerCoins})); 
    });

    let lastTime = 0;
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx, deltaTime);
        requestAnimationFrame(animate);
    };
    
    animate(0);

});

