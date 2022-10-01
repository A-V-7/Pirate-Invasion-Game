const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

let engine;
let world;

var tower, angle;
var balls = [];
var boats=[];
var boatAnimation = [];
var brokenBoatAnimation = [];
var waterAnimation = [];

var isGameOver = false;
var isLaughing = false;

var score = 0;

function preload(){
  bg = loadImage("assets/background.gif");
  towerImg = loadImage("assets/tower.png");
  boatSpriteData = loadJSON("assets/boat/boat.json");
  boatSpriteSheet = loadImage("assets/boat/boat.png");

  brokenBoatSpriteData = loadJSON("assets/boat/broken_boat.json");
  brokenBoatSpriteSheet = loadImage("assets/boat/broken_boat.png");
  
  waterAnimationSpriteData = loadJSON("assets/water_splash/water_splash.json");
  waterAnimationSpriteSheet = loadImage("assets/water_splash/water_splash.png");

  bgMusic = loadSound("assets/background_music.mp3");
  pirateLaugh = loadSound("assets/pirate_laugh.mp3");
  cannonSound = loadSound("assets/cannon_explosion.mp3");
  waterSound = loadSound("assets/cannon_water.mp3");
}



function setup() {
  createCanvas(1200,600);

  engine = Engine.create();
  world = engine.world;
  

  ground = Bodies.rectangle(0,height-1,width*2,1,{isStatic:true});
  World.add(world,ground);

  tower = Bodies.rectangle(160,350,160,310,{isStatic:true});
  World.add(world,tower);
  
  angleMode(DEGREES);
  angle = 15;
  cannon = new Cannon(180,120,130,100,angle);
  
  var boatFrames = boatSpriteData.frames;
  for(var i =0;i<boatFrames.length;i++){
    var pos = boatFrames[i].position;
    var img = boatSpriteSheet.get(pos.x,pos.y,pos.w,pos.h);
    boatAnimation.push(img);
  }
  
  var brokenBoatFrames = brokenBoatSpriteData.frames;
  for(var i =0;i<brokenBoatFrames.length;i++){
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpriteSheet.get(pos.x,pos.y,pos.w,pos.h);
    brokenBoatAnimation.push(img);
  }

  var waterAnimationFrames = waterAnimationSpriteData.frames;
  for(var i =0;i<waterAnimationFrames.length;i++){
    var pos = waterAnimationFrames[i].position;
    var img = waterAnimationSpriteSheet.get(pos.x,pos.y,pos.w,pos.h);
    waterAnimation.push(img);
  }


  rectMode(CENTER);
  ellipseMode(RADIUS);
}

function draw() 
{
  image(bg,0,0,width,height);
  if(!bgMusic.isPlaying()){
    bgMusic.play();
    bgMusic.setVolume(0.1);
  }
  Engine.update(engine);

  rect(ground.position.x,ground.position.y,width*2,1);
  push();
  imageMode(CENTER);
  image(towerImg,tower.position.x,tower.position.y,160,310);

  pop();
  
  
  

  for(var i = 0;i<balls.length;i++){
    showCannonballs(balls[i],i);
    boatCollision(i);
  }

  cannon.display();
  showBoats();
  
  fill("red");
  textSize(40);
  textAlign(CENTER);
  text(`Score:${score}`,100,50);
}

function keyReleased(){
  if(keyCode === 32){
    cannonSound.play();
    balls[balls.length-1].shoot();
  }
}

function keyPressed(){
  if(keyCode === 32){
    var cannonball = new Cannonball(cannon.x,cannon.y+5);
    cannonball.trajectory = [];
    Matter.Body.setAngle(cannonball.body,cannon.angle);
    balls.push(cannonball);
  }
}

function showCannonballs(ball,i){
  if(ball){
    ball.display();
    ball.animate();
    if(ball.body.position.x>=width || ball.body.position.y>=height-50){
      waterSound.play();
      waterSound.setVolume(0.3);
      ball.remove(i);
    }
  }
}

function showBoats(){
  if(boats.length>0){
    if(boats[boats.length-1].body.position.x<width-300){
      var positions = [-40,-60,-70,-20];
      var pos = random(positions);
      var boat = new Boats(width,height-60,170,170,pos,boatAnimation);
      boats.push(boat);
    }

    for(var i in boats){
      if(boats[i]){
        Matter.Body.setVelocity(boats[i].body,{x:-0.9,y:0});
        boats[i].display();
        boats[i].animate();
        var collision = Matter.SAT.collides(tower,boats[i].body);
        if(collision.collided && !boats[i].broken){
          if(!pirateLaugh.isPlaying()&&!isLaughing){
            pirateLaugh.play();
            isLaughing = true;
          }
          isGameOver = true;
          gameOver();
        }
      }
    }
  }
  else{
    var boat = new Boats(width,height-60,170,170,-80,boatAnimation);
    boats.push(boat);
  }
}

function boatCollision(index){
  for(var i = 0; i<boats.length; i++){
    if(balls[index]!=undefined && boats[i]!=undefined){
      var collision = Matter.SAT.collides(balls[index].body,boats[i].body);
      if(collision.collided){
        score += 5;
        boats[i].remove(i);
        World.remove(world,balls[index].body);
        delete balls[index];
      }
    }
  }
}

function gameOver(){
  swal({
    title: `Game Over!`,
    text: "Thanks for playing!",
    imageUrl: "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
    imageSize: "150x150",
    confirmButtonText:"Play Again"
  },
  function (isConfirm){
    if(isConfirm){
      location.reload();
    }
  }
  )
}