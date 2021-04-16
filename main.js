var canvas = document.createElement('canvas');
var ctx=canvas.getContext("2d");
canvas.width=640;
canvas.height=480;
canvas.style.background="#ddd";
document.body.appendChild(canvas);

const BORDER_WIDTH = 35;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 20;
const PLAYER_Y = 310-20;
const OB_WIDTH = 100;
const OB_HEIGHT = 20;

function drawBorders(){
    ctx.beginPath();
    ctx.rect(0,0,BORDER_WIDTH,canvas.height);
    ctx.rect(canvas.width - BORDER_WIDTH,0,BORDER_WIDTH,canvas.height);
    ctx.rect(0,canvas.height-35,canvas.width,35)
    ctx.fillStyle = "#222";
    ctx.fill();
    ctx.closePath();
}

//var obstacles = [];
var newObs = []
var score = 0;
var speed = 2;
var p_speed = 7;
var keyPressLeft = false;
var keyPressRight = false;
var playing = true;

var MainPlayer = {
    x: 320-20,
    y: PLAYER_Y,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    draw: ()=>{
        ctx.beginPath();
        ctx.rect(MainPlayer.x,MainPlayer.y,MainPlayer.width,MainPlayer.height);
        ctx.fillStyle = "#111";
        ctx.fill();
        ctx.closePath();
    },
    moveRight: ()=>{
        MainPlayer.x += (MainPlayer.x >= 640 - BORDER_WIDTH - 20 - 13 ? 0 : p_speed);
    },
    moveLeft: ()=>{
        MainPlayer.x -= (MainPlayer.x <= BORDER_WIDTH + 13 ? 0 : p_speed);
    }
}

function initFunc(){
    newObs=[]
    score = 0
    speed = 2
    keyPressLeft = false
    keyPressRight = false
    for(let i=0;i<=4;i++){
        newObs.push(new ObstacleArray(50-i*(180+OB_HEIGHT)))
    }
    MainPlayer.x = 320-20
    playing = true
}

function displayScore(){
    ctx.font = "15px monospace";
    ctx.fillStyle= "white";
    ctx.fillText('Score: '+score,260,canvas.height-10);
}

class Obstacle{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.width = OB_WIDTH;
        this.height = OB_HEIGHT;
    }
    draw(){
        ctx.beginPath();
        ctx.rect(this.x,this.y,this.width,Math.min(this.height,Math.max(0,(canvas.height-35-this.y))));
        //(this.y+OB_HEIGHT<=canvas.height-35?this.height:Math.max(0,(canvas.height-35-this.y)))
        ctx.fillStyle = "#444";
        ctx.fill();
        ctx.closePath();
    }
    drop(){
        this.y += speed
    }
    collisionDetection(){
        if((this.x<MainPlayer.x && this.x+OB_WIDTH>MainPlayer.x)||(this.x>MainPlayer.x && this.x<MainPlayer.x+PLAYER_WIDTH)){
            return true;
        }
        return false;
    }
}

class ObstacleArray{
    constructor(y){
        this.obs = [];
        this.checked = false;
        this.y = y
        let x = Math.floor((5-1+1)*(Math.random())+1)
        for(let j=1;j<=5;j++){
            if(x == j){
                continue
            }
            this.obs.push(new Obstacle((50+(107.5)*(j-1)),this.y)) //x = 5+(j-1)*145+5*(j-1)
        }
    }
    draw(){
        this.obs.forEach(ob=>ob.draw())
    }
    drop(){
        this.y += speed
        this.obs.forEach(ob => ob.drop())
    }
    collisionDetection(){
        let collides = false
        if((this.y<MainPlayer.y && this.y+OB_HEIGHT>MainPlayer.y)||(this.y<MainPlayer.y+PLAYER_HEIGHT && this.y>MainPlayer.y)){
            this.obs.forEach(ob =>{
                if(ob.collisionDetection()){
                    collides = true
                }
            })
        }
        return collides
    }
    markAsTrue(){
        this.checked = true;
    }
}

for(let i=0;i<=4;i++){
    newObs.push(new ObstacleArray(50-i*(180+OB_HEIGHT)))
}

function checkObstacles(){
    if(newObs[0].y>320 && !(newObs[0].checked)){
        score++;
        newObs[0].markAsTrue();
        if(score%5==0){
            speed *= 1.08
        }
        if(score%20==0){
            p_speed *= 1.075
        }
    }
    if(newObs[0].y >= canvas.height){
        newObs.shift()
        newObs.push(new ObstacleArray(canvas.height-5*(180+OB_HEIGHT)))
    }
}

function update(){
    if(keyPressLeft){
        MainPlayer.moveLeft();
    }else if(keyPressRight){
        MainPlayer.moveRight();
    }
    newObs.forEach(obAr =>{
        obAr.drop()
        if(obAr.collisionDetection()){
            playing = false
        }
    })
    checkObstacles()
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e){
    if(e.key == "Left" || e.key == "ArrowLeft"){
        keyPressLeft = true;
        keyPressRight = false;
    }else if(e.key == "Right" || e.key == "ArrowRight"){
        keyPressLeft = false;
        keyPressRight = true;
    }else if(e.key == "Up" || e.key == "ArrowUp"){
        initFunc()
    }
}

function keyUpHandler(e){
    if(e.key == "Left" || e.key == "ArrowLeft"){
        keyPressLeft = false;
    }else if(e.key == "Right" || e.key == "ArrowRight"){
        keyPressRight = false;
    }
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBorders();
    if(!playing){
        ctx.font = "60px monospace";
        ctx.fillStyle= "#111";
        ctx.fillText("GAME OVER",125,65);
    }else{
        MainPlayer.draw();
        newObs.forEach(obAr => obAr.draw())
        displayScore()
        update();
    }
    requestAnimationFrame(draw);
}
draw()