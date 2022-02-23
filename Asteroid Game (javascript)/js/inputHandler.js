
export default class inputHandler{
    constructor(player){
        document.addEventListener('keydown', event => {
            switch(event.keyCode){
                case 65:
                case 37:
                    player.moveLeft();
                    break;
                case 87:
                case 38:
                    player.moveUp();
                    break;
                case 68:
                case 39:
                    player.moveRight();
                    break;
                case 83:
                case 40:
                    player.moveDown();
                    break;
            }
        });

        document.addEventListener('keyup', event => {
            switch(event.keyCode){
                case 65:
                case 37:
                    player.slowLeft();
                    setTimeout(function(){
                        player.stop();
                    },100);
                    break;
                case 87:
                case 38:
                    player.slowUp();
                    setTimeout(function(){
                        player.stop();
                    },100);
                    break;
                case 68:
                case 39:
                    player.slowRight();
                    setTimeout(function(){
                        player.stop();
                    },100);
                    break;
                case 83:
                case 40:
                    player.slowDown();
                    setTimeout(function(){
                        player.stop();
                    },100);  
                    break;
            }

        });

    }

}