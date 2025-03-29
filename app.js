let gameStart=true;
class Game {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.ctx = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.baseHeight = 720;
        this.ratio = this.height / this.baseHeight;
        this.gravity;
        this.background = new Background(this);
        this.player = new Player(this);
        this.obstacles = [];
        this.numberOfObstacles = 20;
        this.speed;
        this.score;
        this.gameOver;
        this.timer=0;
        this.message1;
        this.message2;
        this.minSpeed;
        this.maxSpeed;
        this.eventTime=0;
        this.eventInterval=150;
        this.eventUpdate=false;
        this.touchStartX;
        this.swipeDistance = 50;
        this.sound = new AudioControl();
        this.bottomMargin;
        this.largeFont;
        this.smallFont;
        this.orientation = screen.orientation.type


        this.resize(window.innerWidth, window.innerHeight)
        
        // console.log(this.orientation)
        
   
        screen.orientation.addEventListener("change",(e)=>{
            // console.log(e);
            this.resize(window.innerWidth,window.innerHeight)
            this.orientation = e.currentTarget.type

        })
        window.addEventListener("resize", (e) => {
            
            this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight)
        })
        


        //mouse event
        window.addEventListener("mousedown", (e) => {
            if(gameStart){
                this.player.flap();
            }
            
        })
        this.canvas.addEventListener("mouseup",(e)=>{
            this.player.wingsUp();
        })

        //keyboard event
        window.addEventListener("keydown", (e) => {
            // console.log(e.code)
            if (e.code === "Space" || e.code === "Enter") {
                if(gameStart){
                    this.player.flap();
                }
           
            }
            if(e.code==="ShiftLeft"||e.code === "KeyC"){
                this.player.startCharge();
            }
            if(e.code === "KeyR"){
                if(this.gameOver){
                    this.resize(window.innerWidth, window.innerHeight);
                }
                
            }
        })
        window.addEventListener("keyup",(e)=>{
            // console.log(e)  
            this.player.wingsUp();
        })

        //touch event
        this.canvas.addEventListener("touchstart", (e) => {
            if(gameStart){
                this.player.flap();

            }
            // console.log(e)
            this.touchStartX = e.changedTouches[0].pageX
            // console.log(this.touchStartX)
            if(this.gameOver){
                this.resize(window.innerWidth,window.innerHeight)
            }
        })
        this.canvas.addEventListener("touchmove",(e)=>{
            if(e.changedTouches[0].pageX - this.touchStartX > this.swipeDistance){
                this.player.startCharge();
            }
        })
        this.canvas.addEventListener("touchend",(e)=>{
            this.player.wingsUp();
        })
    }
   
    resize(width, height) {
        handlePortrait(this.orientation);
        this.gameOver=false;
        this.score=0;
        this.bottomMargin = 50 * this.ratio;
       
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.fillStyle = "blue";
        this.ctx.font = "15px Bungee"
        this.ctx.textAlign = "right"
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ratio = this.height / this.baseHeight;
        this.smallFont = Math.ceil(20 * this.ratio);
        this.largeFont = Math.ceil(45 * this.ratio);
        this.gravity = 0.15 * this.ratio;
        this.speed = 3 * this.ratio;
        this.minSpeed=this.speed;
        this.maxSpeed=this.speed*5;
        this.background.resize();
        this.player.resize();
        this.creatObstacles();
        this.obstacles.forEach(obstacle => {
            obstacle.resize();
        })
        this.timer=0;
      
    }
    render(deltaTime) {
        // console.log(deltaTime)
        // console.log(this.timer)
        this.timer += deltaTime;
        // console.log(this.timer)
        this.handlePeriodicEvents(deltaTime)
        this.background.draw();
        this.background.update();
       
        this.player.draw();
        this.player.update();
        this.obstacles.forEach(obstacle => {
            obstacle.update();
            obstacle.draw();
        })
        this.drawScoreText();
    }
    creatObstacles() {
        this.obstacles = [];
        const firstX = this.baseHeight*this.ratio;
        const obsctacleSpace = 600*this.ratio;
        for (let i = 0; i < this.numberOfObstacles; i++) {
            this.obstacles.push(new Obstacle(this, firstX + i * obsctacleSpace));
        }
    }
    formateTime(){
        return (this.timer*0.001).toFixed(2)
    }
    handleGameOver(){
        if(this.player.collided){
            this.sound.play(this.sound.moremoro,this.sound.chakala);
            this.message1="Game Over";
            this.message2="The sparow can never become a falcon";
        }else if(this.obstacles.length<=0){
            this.sound.play(this.sound.win);
            this.message1="You Win";
            this.message2="The sparow has become a falcon";
        }
    }
    drawScoreText(){
        this.ctx.save();
        this.ctx.fillText("Score: "+this.score,this.width-10,20);
        this.ctx.textAlign = "left";
        this.ctx.fillText("Time: "+this.formateTime(),10,20)
        this.ctx.fillStyle = "red"
        this.ctx.textAlign ="center"
        this.ctx.font=15+"px roboto"
        this.ctx.fillText("press 'c' OR 'swipe right' to Boost",this.width*0.5,15)
        if(this.gameOver){
           this.handleGameOver();
            this.ctx.textAlign = "center";
            this.ctx.font=this.largeFont+"px Bungee";
            this.ctx.fillStyle = "red";
            this.ctx.fillText( this.message1, this.width*0.5,this.height*0.5-40,this.width)
            this.ctx.font=this.smallFont+"px Bungee"
            this.ctx.fillText( this.message2, this.width*0.5,this.height*0.5-10,this.width);
            this.ctx.fillStyle="green"
            this.ctx.fillText("Press 'R' OR 'click any where' To Restart",this.width*0.5,this.height*0.5+20,this.width)
        }
        if(this.player.energy<=this.player.minEnergy){
            this.ctx.fillStyle="red";
        }else if(this.player.energy>=this.player.maxEnergy){
            this.ctx.fillStyle="orangered"
        }
        for(let i=0;i<this.player.energy;i++){
            
            this.ctx.fillRect(10 + i*2,25,3,20)
        }
        this.ctx.restore();
    }
    checkCollison(a,b){
        
        const dx = a.collisonX - b.collisonX;
        const dy = a.collisonY-b.collisonY;
        const distance = Math.hypot(dx,dy);
        const sumOfRedius = a.collisonReduis+b.collisonReduis;
        return distance <= sumOfRedius   
    }
    handlePeriodicEvents(deltaTime){
        if(this.eventTime < this.eventInterval){
            this.eventTime += deltaTime;
            this.eventUpdate=false;
        }
        else{
            this.eventTime = this.eventTime % this.eventInterval;
            this.eventUpdate = true;
        }
    }
    isLangscape(){
        return this.orientation === "landscape-primary"
    }

}



window.addEventListener("load", () => {
    
    const canvas = document.getElementById("canvas1");
    
    const ctx = canvas.getContext("2d")
    canvas.width = 720;
    canvas.height = 720;
    const game = new Game(canvas, ctx);

    let lastTime=0;
    function animation(timeStamp) {
        const deltaTime = timeStamp-lastTime;
        lastTime = timeStamp;
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        if(!game.gameOver && gameStart){
            game.render(deltaTime);
        }
        
        requestAnimationFrame(animation);
    }
    requestAnimationFrame(animation);
})


function handlePortrait(orientation){

    if(orientation === "landscape-primary"){
        document.getElementById("canvas1").style.display = "block";
        document.getElementById("video").style.display ="none";
        gameStart=true;
    }
    else{
        document.getElementById("canvas1").style.display = "none";
        document.getElementById("video").style.display = "block";
        gameStart=false;

    }
    
}