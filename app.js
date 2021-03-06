let canvas =document.getElementById('my_canvas');
let pantalla = new Pantalla(canvas, canvas.getContext('2d'));
const playerSprite = new Image();
playerSprite.src = "./Assets/SpaceShooterAssets/SpaceShooterAssetPack_Ships.png";
const background = new Image();
background.src = "./Assets/background-black.png"

const player = new Player(playerSprite,pantalla,350,300,8,7,8,0,3,3,4,false);
const enemies = [];
const enemySpawnDelay=60;
let enemySpawnCount=enemySpawnDelay;
const animations = [];
const mouse = {x:0, y:0};

window.addEventListener("keydown", (event) =>{
    // console.log(event.code);
    player.keys[event.code] = {'active':true,'uncontrollable':false};
});

window.addEventListener("keyup", (event) =>{
    if(!player.keys[event.code]['uncontrollable']){
        delete player.keys[event.code];
    }
});

document.addEventListener("mousemove",(e)=>{
    var bounds = canvas.getBoundingClientRect();
    mouse.x = e.pageX - bounds.left;
    mouse.y = e.pageY - bounds.top;
});

document.addEventListener("mousedown", (e)=>{
   player.keys[e.button] = {'active':true,'uncontrollable':false};
});

document.addEventListener("mouseup", (e) =>{
    if(!player.keys[e.button]['uncontrollable']){
        delete player.keys[e.button];
    }
});

function spawnEnemies(){
    if(enemySpawnCount == enemySpawnDelay){
        const e={
            radius:30,
            width:8*2,
            height:8*2,
            frame:{x:32, y:48},
            scale:{w:2, h:2},
            velocity:{x:2,y:2},
            speed:2,
            angle:Math.random() * (361 - 0) + 0
        }
        
        enemies.push(new Enemy(
            pantalla,
            player,
            e.radius,
            e.width,
            e.height,
            e.frame,
            e.scale,
            e.speed,
            e.velocity,
            e.angle
        ));
    }
    enemySpawnCount--;

    if(enemySpawnCount == 0){
        enemySpawnCount = enemySpawnDelay;
    }

}


let fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps) {
    fpsInterval = 1000/fps;
    then = Date.now();
    startTime = then;
    animate();
}

function animate(){
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if(elapsed > fpsInterval){
        then = now - (elapsed % fpsInterval);
        pantalla.ctx.clearRect(0, 0, canvas.width, canvas.height);
        pantalla.ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        player.start(mouse);
        spawnEnemies();
        enemies.forEach((e,i)=>{
            if(e.run()){
                if(e.shooted){
                    animations.push(new Animation('destroy', e));
                }
                enemies.splice(i,1);
            }
        });

        if(animations.length > 0){
            animations.forEach((e,i)=>{
                //do animations.
                if(!e.erase){
                    e.run();
                }else{
                    animations.splice(i,1);
                }
            });
        }
    }
}

startAnimating(60);