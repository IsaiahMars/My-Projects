import inputHandler from "./inputHandler.js";
import Player from "./player.js";
import Asteroid from "./asteroid.js";
import Alien from "./alien.js";
import UFO from "./ufo.js";
import Projectile from "./projectiles.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

let player = new Player();
const text = document.getElementById('text');
const life1 = document.getElementById('life1');
const life2 = document.getElementById('life2');
const life3 = document.getElementById('life3');
const playerHP = document.getElementById('playerHP');
const startButton = document.getElementById('startButton');
const menu = document.getElementById('menu');

let input = new inputHandler(player);
const mouse = {x: 0, y: 0};

let obstacles = [[],[],[]];
let projectiles = [];

function spawnAsteroids(){
    setInterval(() => {
        let x, y;
        if(Math.random() < .5){
            x = 0 - 50
            y = Math.random() * canvas.height - 100;            // random x, y coordinate generator
        }
        else{
           x = Math.random() * canvas.width - 200;
           y = 0 - 50
        }
        if(obstacles[0].length < 6){
            obstacles[0].push(new Asteroid(x, y));
        }
        //console.log(obstacles[0])
    }, 1000)
}

function spawnAliens(){
    setInterval(() => {
        let x, y;
        if(Math.random() < .5){
            x = Math.random() < .5 ? 0 - 30 : canvas.width + 30;
            y = Math.random() * canvas.height;
        }
        else{
           x = Math.random() * canvas.width;
           y = Math.random() < .5 ? 0 - 60 : canvas.height + 60;
        }

        const angle = Math.atan2(player.position.y - y, player.position.x - x)
        const speed = { x: Math.cos(angle) * 1.5, y: Math.sin(angle) * 1.5}

        if(obstacles[1].length < 5){
            obstacles[1].push(new Alien(x, y, speed));
        }
        //console.log(obstacles[1])
    }, 3000)
}

function spawnUFOs(){
    setInterval(() => {
        let y = Math.random() * (canvas.height - 100) + 100;  // random y coordinate generator
        if(obstacles[2].length < 3){
            obstacles[2].push(new UFO(-70, y));
        }
        //console.log(obstacles[2])
    }, 5000)
}

function startGame(){
    player = new Player();
    input = new inputHandler(player);
    obstacles = [[],[],[]];
    projectiles = [];
    
    life3.style.display = 'inline-block';
    life2.style.display = 'inline-block';
    life1.style.display = 'inline-block';
    text.style.display = 'inline-block';
}


let tick;
const background = document.getElementById('backgroundImage')
let backgroundSpeed = 1;
let x = -5;
let x2 = 795;

function gameLoop(){
    tick = requestAnimationFrame(gameLoop);


    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(background, x, 0, canvas.width + 2, canvas.height + 2);
    ctx.drawImage(background, x2, 0, canvas.width + 2, canvas.height + 2);
    if(x > 800) { x = -800}
    else { x += backgroundSpeed }
    if(x2 > 800) { x2 = -800}
    else { x2 += backgroundSpeed }
    
    player.update(ctx);

    obstacles[0].forEach((asteroid, index) =>{
        asteroid.update(ctx);

        if(asteroid.x > canvas.width || asteroid.y > canvas.height){
             setTimeout(() =>{
                 obstacles[0].splice(index, 1)
             }, 0)
        }
        if(asteroid.x > player.position.x + player.dimensions.w - 10 ||
           asteroid.x + asteroid.width - 15 < player.position.x ||
           asteroid.y > player.position.y + player.dimensions.h - 10 ||
           asteroid.y + asteroid.height - 15 < player.position.y )  { /*do nothing*/ }
        else{
            if(asteroid.counted == false){
                player.hitpoints--;
                if(player.hitpoints == 2){
                    life3.style.display = 'none';
                }
                if(player.hitpoints == 1){
                    life2.style.display = 'none';
                }
                if(player.hitpoints == 0){
                    life1.style.display = 'none';
                }
                asteroid.counted = true;
            }
        }
    })

    obstacles[1].forEach((alien, index) =>{
        alien.update(ctx);

        if(alien.x > canvas.width + 100 ||
             alien.x < 0 - 100 ||
             alien.y > canvas.height + 100 ||
             alien.y < 0 - 100){
             setTimeout(() =>{
                 obstacles[1].splice(index, 1)
             }, 0)
        }
        if(alien.x > player.position.x + player.dimensions.w - 5 ||
            alien.x + alien.width - 5 < player.position.x ||
            alien.y > player.position.y + player.dimensions.h - 10 ||
            alien.y + alien.height - 10 < player.position.y )  { /*do nothing*/ }
        else{
            if(alien.counted == false){
                player.hitpoints--;
                if(player.hitpoints == 2){
                    life3.style.display = 'none';
                }
                if(player.hitpoints == 1){
                    life2.style.display = 'none';
                }
                if(player.hitpoints == 0){
                    life1.style.display = 'none';
                }
                alien.counted = true;
            }
        }
    })

    obstacles[2].forEach((ufo, index) =>{
        ufo.update(ctx);

        if(ufo.x > canvas.width){
             setTimeout(() =>{
                 obstacles[2].splice(index, 1)
             }, 0)
        }
        if(ufo.x > player.position.x + player.dimensions.w - 10 ||
            ufo.x + ufo.width - 10 < player.position.x ||
            ufo.y > player.position.y + player.dimensions.h - 5 ||
            ufo.y + ufo.height - 5 < player.position.y )  { /*do nothing*/ }
        else{
            if(ufo.counted == false){
                player.hitpoints--;
                if(player.hitpoints == 2){
                    life3.style.display = 'none';
                }
                if(player.hitpoints == 1){
                    life2.style.display = 'none';
                }
                if(player.hitpoints == 0){
                    life1.style.display = 'none';
                }
                ufo.counted = true;
            }
        }
    })

    projectiles.forEach((projectile, index) =>{
        projectile.update(ctx);

        if(projectile.x + projectile.width < 0 ||
           projectile.x - projectile.width > canvas.width || 
           projectile.y + projectile.height < 0 ||
           projectile.y - projectile.height > canvas.height){
            setTimeout(() =>{
                projectiles.splice(index, 1)
            }, 0)
        }
    })

    projectiles.forEach((projectile, index) => {
        for(let i = 1; i < 3; i++){
            obstacles[i].forEach((obstacle, index2) => {
                if(projectile.x > obstacle.x &&
                    projectile.x + projectile.radius < obstacle.x + obstacle.width &&
                    projectile.y > obstacle.y &&
                    projectile.y + projectile.radius < obstacle.y + obstacle.height){ 
                        if(i == 1){
                            setTimeout(() =>{
                                projectiles.splice(index, 1)
                                obstacles[i].splice(index2, 1)
                            }, 0)
                        }
                        else{
                            setTimeout(() =>{
                                projectiles.splice(index, 1)
                            }, 0)
                            obstacle.hitpoints--;
                            if(obstacle.hitpoints == 0){
                                setTimeout(() =>{
                                    obstacles[i].splice(index2, 1)
                                }, 0)
                            }
                            
                        }
                    }
            })
        }
    })

    if(player.hitpoints < 1){
        cancelAnimationFrame(tick);
        menu.style.display = 'inline-block';
    }

}

let canvasPosition = canvas.getBoundingClientRect();
window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
});
window.addEventListener('scroll', function(){
    canvasPosition = canvas.getBoundingClientRect();
});



canvas.addEventListener('click', (event) => {
    console.log(projectiles)  
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    console.log(mouse)
        
    const angle = Math.atan2(mouse.y - player.position.y, mouse.x - player.position.x);
   
    //console.log(angle);
    const speed = {x: Math.cos(angle) * 3.5, y: Math.sin(angle) * 3.5}
    
    projectiles.push(new Projectile(player.position.x + 17.5, player.position.y + 25, speed))  
})

startButton.addEventListener('click', () =>{
    startGame();
    gameLoop();

    spawnAsteroids();
    spawnAliens();
    spawnUFOs();
    menu.style.display = 'none';
})








