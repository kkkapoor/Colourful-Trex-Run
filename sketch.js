var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running;// trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

var sun,sun_img;

var sunStop;

var jumpSound;
var checkPointSound;
var dieSound;

var highscore;
highscore = 0;

function preload(){
  trex_running =   loadAnimation("t1.png","t2.png","t3.png","t4.png","t5.png");
  //trex_collided = loadAnimation("trex_collided.png");
  trexStop = loadAnimation("t2.png");
  
  groundImage = loadImage("gt.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("o1.png");
  obstacle2 = loadImage("o2.png");
  obstacle3 = loadImage("o3.png");
  obstacle4 = loadImage("o4.png");
  obstacle5 = loadImage("o5.png");
  obstacle6 = loadImage("o6.png");
  
  sun_img = loadAnimation("s1.png","s2.png");
  sunStop = loadAnimation("s1.png");
  
  gameOverImg = loadImage("gameover.png");
  restartImg = loadImage("re.png");
  jumpSound = loadSound("jump.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  dieSound = loadSound("die.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("s",sun_img);
  sun.addAnimation("ss",sunStop);
  sun.scale = 1;
  
   ground = createSprite(width/2,height-20,width,20);
 ground.scale=2.2;
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  
  trex = createSprite(70,height-150,20,50);
  //trex.debug=true;
  trex.setCollider("circle",0,0,20);
  trex.scale=1.7;
  trex.addAnimation("running", trex_running);
  trex.addAnimation("stop",trexStop);
  //trex.addAnimation("collided", trex_collided);
 
  
 
  gameOver = createSprite(width/2,height/2,10,10);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1.3;
  
  restart = createSprite(width/2,height/2 + 70,10,10);
  restart.addImage(restartImg);
  
 
  restart.scale = 1;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-40,width,125);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background("cyan");
  stroke("black");
  fill("black");
  textSize(20);
  text("Score: "+ score, 440,50);
  text("HighScore:" + highscore,300,50);
  console.log(trex.y);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(touches.length > 0 || keyDown("space") && trex.y >= height-150) {
      trex.velocityY = -12
      jumpSound.play();
      touches = [];
    }
  
    if(score>0 && score%100 === 0){
      checkPointSound.play();
    }
    
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      dieSound.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("stop",trexStop);
    sun.changeAnimation("ss",sunStop)
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(highscore < score){
      highscore = score;
    }
    
    if(mousePressedOver(restart) || touches.length>0) {
      reset();
      touches = [];
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-350,40,10);
    cloud.y = Math.round(random(80,350));
    cloud.addImage(cloudImage);
    cloud.scale = 1.2;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(width+20,height-120,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    obstacle.setCollider("circle",0,0,25);
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 1.3;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  sun.changeAnimation("s",sun_img);
  
  score = 0;
  
}