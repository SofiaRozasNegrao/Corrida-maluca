class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Digite Seu Nome");
    this.playButton = createButton("Jogar");
    this.titleImg = createImg("./assets/title.png", "game title");
    this.greeting = createElement("h2");
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  setElementsPosition(){
    this.input.position(width/2-110,height/2-80)
    this.playButton.position(width/2-90,height/2-20)
    this.titleImg.position(120,160)
    this.greeting.position(width/2-300,height/2-100)
  }

  setElementsStyle(){
    this.input.class("customInput")
    this.playButton.class("customButton")
    this.titleImg.class("gameTitle")
    this.greeting.class("greeting")
  }

  pressedMouse(){
    this.playButton.mousePressed(() => {
      this.input.hide()
      this.playButton.hide()

      let message=`Olá, ${this.input.value()}!</br> Espere outro jogador se conectar`
      this.greeting.html(message)
      playersCount+=1
      player.updatePlayersCount(playersCount)
      player.name=this.input.value()
      player.index=playersCount
      player.addPlayer()
      player.getDistance()
    })
  }

  display(){
    this.setElementsPosition()
    this.setElementsStyle()
    this.pressedMouse()
  }

}
