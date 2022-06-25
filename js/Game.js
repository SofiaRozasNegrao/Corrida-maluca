class Game {
  constructor() {
    this.resetTitle=createElement("h2")
    this.resetButton=createButton("")
    this.leaderBoardTitle=createElement("h2")
    this.leader1=createElement("h2")
    this.leader2=createElement("h2")
    this.isMoving=false
    this.isLeftKeyActive=false
    this.blast=false
  }

  start() {
    player = new Player();
    playersCount=player.getPlayersCount()
    form = new Form();
    form.display();

    car1=createSprite(width/2-50,height-100)
    car1.addImage(car1_img)
    car1.scale=0.07

    car2=createSprite(width/2+100,height-100)
    car2.addImage(car2_img)
    car2.scale=0.07

    cars=[car1,car2]

    fuels=new Group()
    coins=new Group()
    obstacles=new Group()

    let obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2_img },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1_img },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1_img },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2_img },
      { x: width / 2, y: height - 2800, image: obstacle2_img },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1_img },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2_img },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2_img },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1_img },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2_img },
      { x: width / 2, y: height - 5300, image: obstacle1_img },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2_img }
    ];

    this.addSprites(fuels, 4, fuel_img, 0.02)
    this.addSprites(coins, 18, coin_img, 0.09)
    this.addSprites(obstacles, obstaclesPositions.length, obstacle1_img, 0.04, obstaclesPositions)
  }

  getState(){
    let gameStateRef=database.ref("gameState")
    gameStateRef.on("value", (data)=>{
      gameState=data.val()
    })

  }

  updateState(state){
    let gameStateRef=database.ref("/")
    gameStateRef.update({
      gameState: state
    })
  }

  play(){
    form.hide()
    form.titleImg.position(40,50)
    form.titleImg.class("gameTitleAfterEffect")

    this.resetTitle.html("Reiniciar jogo")
    this.resetTitle.class("resetText")
    this.resetTitle.position(width/2+200,40)

    this.resetButton.class("resetButton")
    this.resetButton.position(width/2+230,100)
    
    this.leaderBoardTitle.html("Placar")
    this.leaderBoardTitle.class("resetText")
    this.leaderBoardTitle.position(width/3-60,42)

    this.leader1.class("leadersText")
    this.leader1.position(width/3-50,80)

    this.leader2.class("leadersText")
    this.leader2.position(width/3-50,130)

    this.resetGame()

    player.getPlayers()
    player.getCarsAtEnd()

    if(allPlayers!== undefined){
      image(track,0,-height * 5, width, height * 6)

      this.showLeaderBoard()
      this.showFuelBar()
      this.showLifeBar()

      let index=0
      for (const key in allPlayers) {
      index+=1
      let x =allPlayers[key].positionX
      let y =height-allPlayers[key].positionY

      const currentLife=allPlayers[key].life
      if(currentLife<=0){
        cars[index-1].addImage(boom)
        cars[index-1].scale=0.3
      }

      cars[index-1].position.x=x
      cars[index-1].position.y=y

      if(index=== player.index){
        stroke(10)
        fill("red")
        ellipse(x,y,60,60)

        this.handleFuel(index)
        this.handleCoins(index)
        this.collisionWithObstacle(index)
        this.collisionWithCar(index)

        if(player.life<=0){
          this.blast=true
          this.isMoving=false
        }

        //camera.position.x=cars[index-1].position.x
        camera.position.y=cars[index-1].position.y
      }
      }
      this.playerControl()

      const finishLine=height*6-100
      if(player.positionY>finishLine){
        gameState=2
        player.ranking+=1
        player.updateCarsAtEnd(player.ranking)
        player.updatePlayer()
        this.showRanking()
      }

      drawSprites()
    }
  }

  playerControl(){
    if(!this.blast){
      if(keyIsDown(UP_ARROW)){
        this.isMoving=true
        player.positionY+=10
        player.updatePlayer()
      }
  
      if(keyIsDown(LEFT_ARROW) && player.positionX >width/3-50){
        this.isLeftKeyActive=true
        player.positionX-=5
        player.updatePlayer()
      }
  
      if(keyIsDown(RIGHT_ARROW)&& player.positionX< width/2+300){
        this.isLeftKeyActive=false
        player.positionX+=5
        player.updatePlayer()
      }
    }  
  }

  showLeaderBoard(){
    let leader1,leader2
    let players=Object.values(allPlayers)

    if((players[0].ranking===0 && players[1].ranking===0) || players[0].ranking===1){ 
      leader1=players[0].ranking+'&emsp;'+players[0].name+ '&emsp;'+ players[0].score
      leader2=players[1].ranking+'&emsp;'+players[1].name+ '&emsp;'+ players[1].score
    }

    if(players[1].ranking===1){
      leader1=players[1].ranking+'&emsp;'+players[1].name+ '&emsp;'+ players[1].score
      leader2=players[0].ranking+'&emsp;'+players[0].name+ '&emsp;'+ players[0].score
    }

    this.leader1.html(leader1)
    this.leader2.html(leader2)
  }

  resetGame(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        playersCount:0,
        gameState:0,
        players:{},
        carsAtEnd:0
      })
      window.location.reload()
    })
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions=[]){
    for (let item  = 0; item < numberOfSprites; item ++) {
      let x,y
      
      if(positions.length>0){
        x=positions[item].x
        y=positions[item].y
        spriteImage=positions[item].image
      }else{
        x=random(width/2+150,width/2-150)
        y=random(-height*4.5,height-400)
      }

      let sprite=createSprite(x,y)
      sprite.addImage(spriteImage)
      sprite.scale=scale
      spriteGroup.add(sprite)
    }
  }

  handleFuel(index){
    cars[index-1].overlap(fuels,(collector, collected)=>{
      player.fuel=185
      collected.remove()
    })

    if(player.fuel>0 && this.isMoving){
      player.fuel-=0.3
    }

    if(player.fuel<=0){
      gameState=2
      this.gameOver()
    }
  }

  handleCoins(index){
    cars[index-1].overlap(coins,(collector, collected)=>{
      player.score+=21
      player.updatePlayer()
      collected.remove()
    })
  }

  showFuelBar(){
    push()
    image(fuel_img,width/2-130,height-player.positionY-350,20,20)
    fill("white")
    rect(width/2-100,height-player.positionY-350,185,20)
    fill("#ffc400")
    rect(width/2-100,height-player.positionY-350,player.fuel,20)
    noStroke()
    pop()
  }

  showLifeBar(){
    push()
    image(life_img,width/2-130,height-player.positionY-400,20,20)
    fill("white")
    rect(width/2-100,height-player.positionY-400,185,20)
    fill("#f50057")
    rect(width/2-100,height-player.positionY-400,player.life,20)
    noStroke()
    pop()
  }

  showRanking(){
    swal({
      title:`Incrível!!! ${"\n"} ${player.ranking}º lugar`,
      text:"Você alcançou a linha de chegada com sucesso!!!",
      imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize:"100x100",
      confirmButtonText:"ok"
    })
  }

  gameOver(){
    swal({
      title:`Fim de jogo!`,
      text:"Poxa...Você perdeu a corrida! :(",
      imageUrl: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize:"100x100",
      confirmButtonText:"Obrigada por jogar!"
    })
  }

  collisionWithObstacle(index){
    if(cars[index-1].collide(obstacles)){
      if(this.isLeftKeyActive){
        player.positionX+=100
      }else{
        player.positionX-=100
      }

      if(player.life>0){
        player.life-=185/4
      }

      player.updatePlayer()
    }
  }

  collisionWithCar(index){
    if(index===1){
      if(cars[0].collide(cars[1])){
        if(this.isLeftKeyActive){
          player.positionX+=100
        }else{
          player.positionX-=100
        }
  
        if(player.life>0){
          player.life-=185/4
        }
  
        player.updatePlayer()
      }
    }

    if(index===2){
      if(cars[1].collide(cars[0])){
        if(this.isLeftKeyActive){
          player.positionX+=100
        }else{
          player.positionX-=100
        }
  
        if(player.life>0){
          player.life-=185/4
        }
  
        player.updatePlayer()
      }
    }
  }
  
}
