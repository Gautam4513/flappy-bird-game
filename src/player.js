class Player{
    constructor(game){
        this.game=game;
        this.x=10;
        this.y=10;
        this.spriteWidth=200;
        this.spriteHeight=200;
        this.width=100;
        this.height=100;
        this.speedY;
        this.flapSpeed;
        this.collisonX;
        this.collisonY;
        this.collisonReduis = this.width*0.5;
        this.collided;
        this.energy=30;
        this.maxEnergy=this.energy*2;
        this.minEnergy=15;
        this.charging;
        this.img = document.getElementById("player_fish")
        this.frameY;
    }
    draw(){
        // this.game.ctx.fillRect(this.x , this.y , this.width,this.height);
        this.game.ctx.drawImage(this.img,0,this.frameY*this.spriteHeight,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height)
        // this.game.ctx.beginPath();
        // this.game.ctx.arc(this.collisonX,this.collisonY,this.collisonReduis,0,Math.PI*2);
        // this.game.ctx.stroke();
    }
    update(){
        this.handleEnergy();
        if(this.speedY >=0){
            this.wingsUp();
        }
        this.y += this.speedY;
        this.collisonX=this.x+this.width*0.5+(40*this.game.ratio);
        this.collisonY=this.y+this.height*0.5;
        if(!this.isTouchingBottom() && !this.charging){
            this.speedY += this.game.gravity;
          
        }
        else{
            this.speedY=0;
        }
        if (this.isTouchingBottom() ){
            this.wingsIdeal()
            this.y = this.game.height-this.height-this.game.bottomMargin;
            // console.log(this.game.bottomMargin)
        }
    }
    wingsIdeal(){
        if(!this.charging) this.frameY=0;
    }
    wingsUp(){
        if(!this.charging) this.frameY=2;
    }
    wingsDown(){
        this.frameY=1;
    }
    wingsCharge(){
        this.frameY=3;
    }
    resize(){
        this.width = this.spriteWidth * this.game.ratio;
        this.height = this.spriteHeight * this.game.ratio;
        this.y = this.game.height*0.5 - this.height*0.5;
        this.speedY = -8 * this.game.ratio;
        this.flapSpeed = 5 * this.game.ratio;
        this.collisonReduis=40*this.game.ratio;;
        this.collided=false;
        this.wingsIdeal();
       
    }
    isTouchingTop(){
        return this.y <= 0;
    }
    isTouchingBottom(){
        // console.log(this.game.bottomMargin)
        return this.y >= this.game.height - this.height - this.game.bottomMargin
    }
    flap(){
        this.stopCharge()
        if(!this.isTouchingTop() && !this.game.gameOver){
            this.game.sound.play(this.game.sound.flapSoundArray[Math.floor(Math.random()*5)]);
            this.speedY = -this.flapSpeed;
            this.wingsDown();
        }
        
    }
    handleEnergy(){
        if(this.game.eventUpdate){
            if(this.energy<this.maxEnergy){
                this.energy +=1;
            }
            if(this.charging){
                this.energy-=6;
                if(this.energy<=0){
                    this.energy=0;
                    this.stopCharge();
                }    
            }
          
        }
        
    }
    startCharge(){
        if(this.energy >= this.minEnergy && !this.game.gameOver){
            this.game.sound.play(this.game.sound.charge)
            this.charging=true;
            this.game.speed=this.game.maxSpeed;
            this.wingsCharge();
        }
        
    }
    stopCharge(){
        this.charging=false;
        this.game.speed=this.game.minSpeed;
        this.wingsIdeal();
    }
}