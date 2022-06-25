let database
let form, player,game;
let backgroundImage
let gameState
let playersCount
let allPlayers
let car1,car2,car1_img,car2_img,cars=[]
let fuels, coins, obstacles
let fuel_img, coin_img, obstacle1_img, obstacle2_img
let boom

function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  car1_img = loadImage("../assets/car1.png");
  car2_img = loadImage("../assets/car2.png");
  track = loadImage("../assets/PISTA.png");
  fuel_img = loadImage("./assets/fuel.png");
  coin_img = loadImage("./assets/goldCoin.png");
  obstacle1_img = loadImage("./assets/obstacle1.png");
  obstacle2_img = loadImage("./assets/obstacle2.png");
  life_img = loadImage("./assets/life.png");
  boom = loadImage("../assets/blast.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  
  if(playersCount===2){
    game.updateState(1)
  }

  if(gameState===1){
    game.play()
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
