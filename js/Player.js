class Player {
  constructor() {
    this.name=null
    this.index=null
    this.positionX=0
    this.positionY=0
    this.ranking=0
    this.score=0
    this.fuel=185
    this.life=185
  }

  getPlayers(){
    let playersRef=database.ref("players")
    playersRef.on("value",(data=>{
      allPlayers=data.val()
    }))
  }

 getPlayersCount(){
   let playersCountRef=database.ref("playersCount")
   playersCountRef.on("value",(data)=>{
    playersCount=data.val()
   })
 }

 updatePlayersCount(count){
  let playersCountRef=database.ref("/")
  playersCountRef.update({
    playersCount:count
  })
 }

 addPlayer(){
   let playerIndex="players/player"+this.index
   if(this.index===1){
    this.positionX=width/2-100
   }else{
    this.positionX=width/2+100
   }

   let addPlayerRef=database.ref(playerIndex)
   addPlayerRef.set({
    name: this.name,
    positionX:this.positionX,
    positionY:this.positionY,
    ranking:this.ranking,
    score:this.score
   })
 }

 updatePlayer(){
  let playerIndex="players/player"+this.index
  let playerRef=database.ref(playerIndex)
  playerRef.update({
    positionX:this.positionX,
    positionY:this.positionY,
    ranking:this.ranking,
    score:this.score,
    life: this.life
   })
 }

 getDistance(){
   let playerIndex="players/player"+this.index
   let playerRef=database.ref(playerIndex)
   playerRef.on("value", data =>{
     let info=data.val()
     this.positionX=info.positionX,
     this.positionY=info.positionY
   })
 }

 getCarsAtEnd(){
  let carsAtEndRef=database.ref("carsAtEnd")
  carsAtEndRef.on("value", (data)=>{
    this.ranking=data.val()
  })
 }

 updateCarsAtEnd(ranking){
   let databaseRef=database.ref("/")
   databaseRef.update({
     carsAtEnd:ranking
   })
 }
}
