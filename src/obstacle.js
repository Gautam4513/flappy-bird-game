class Obstacle {
    constructor(game,x){
        this.game = game;
        this.spriteWidth = 120;
        this.spriteHeight = 120;
        this.scaledWidth = this.spriteWidth * this.game.ratio;
        this.scaledHeight = this.spriteHeight * this.game.ratio;
        this.x = x;
        this.y = Math.random() *(this.game.height - this.scaledHeight-this.game.bottomMargin);
        this.speedY = Math.random() > 0.5 ? 2*this.game.ratio : -2*this.game.ratio;
        this.markForDelet=false;
        this.collisonX;
        this.collisonY;
        this.collisonReduis = this.scaledWidth*0.5;
        this.img = document.getElementById("obstacles")
        this.frameX=Math.floor(Math.random()*4);  

    }

    update(){
        this.x -=  this.game.speed;
        this.y += this.speedY;
        this.collisonX=this.x+this.scaledWidth*0.5;
        this.collisonY=this.y+this.scaledHeight*0.5;
        if(this.y <=0 || this.y > this.game.height - this.scaledHeight-this.game.bottomMargin){
            this.speedY *= -1;
        }
        if(this.isOfScreen()){
            this.markForDelet = true;
            this.game.obstacles = this.game.obstacles.filter(obstacle => !obstacle.markForDelet)
            // console.log(this.game.obstacles.length)
            this.game.score++;
            if(this.game.obstacles.length <= 0){
                this.game.gameOver = true;
                // console.log(this.game.gameOver)
            }
        }
        if(this.game.checkCollison(this,this.game.player)){
            this.game.gameOver=true;
            this.game.player.collided=true;
        }
    }

    draw(){
        // this.game.ctx.fillRect(this.x,this.y,this.scaledWidth,this.scaledHeight );
        this.game.ctx.drawImage(this.img,this.frameX*this.spriteWidth,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.scaledWidth,this.scaledHeight)
        // this.game.ctx.beginPath();
        // this.game.ctx.arc(this.collisonX,this.collisonY,this.collisonReduis,0,Math.PI*2);
        // this.game.ctx.stroke();
        
    }
    resize(){
        this.scaledWidth = this.spriteWidth * this.game.ratio;
        this.scaledHeight = this.spriteHeight * this.game.ratio;
        this.collisonReduis = 40*this.game.ratio;
     
    }
    isOfScreen(){
        return this.x < -this.scaledWidth;
    }
}