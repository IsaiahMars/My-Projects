import Player from "./player.js";
import InputHandler from "./inputHandler.js";
import Path from "./path.js";

window.addEventListener('load', function(){
    const canvas = document.getElementById('main-canvas');
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

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.topMargin = 260;
            this.lastKey = undefined;
            this.lastPath = document.getElementById('lastPath')
            this.leftPath = new Path(50, 150, 0, 470, 'homePathLeftBtn');
            this.rightPath = new Path(50, 150, 1030, 470, 'homePathRightBtn')
            this.topPath = new Path(100, 30, 530, 300, "homePathTopBtn")
            this.input = new InputHandler(this);
            if(this.lastPath.getAttribute('lastpath') == 'und'){
                this.player = new Player(this, 200, 300);
            }
            else if(this.lastPath.getAttribute('lastpath') == 'pathLeft'){
                this.player = new Player(this, 0, 470);
            }
            else if(this.lastPath.getAttribute('lastpath') == 'pathRight'){
                this.player = new Player(this, 980, 470);
            }
            
            this.gameObjects = [this.player];
            this.paths = [this.leftPath, this.rightPath, this.topPath];
        }

        render(context, deltaTime){
            this.paths.forEach(object => {
                if(this.player.x > object.x + object.width ||
                   this.player.x + this.player.width < object.x ||
                   this.player.y > object.y + object.height ||
                   this.player.y + this.player.height < object.y){
                    object.button.style.display = "none";
                }
                else{
                    object.button.style.display = "flex";
                }
            });  
            this.gameObjects.forEach(object => {
                object.draw(context);
                object.update(deltaTime)
            });  
        }


    }

    const game = new Game(canvas.width, canvas.height);

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
