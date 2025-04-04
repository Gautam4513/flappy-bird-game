class Background {
    constructor(game){
        this.game=game;
        this.img = document.getElementById("background");
        this.width=2400;
        this.height = this.game.baseHeight;
        this.x;
        this.scaledWidth;
        this.scaledHeight;

       
    }
    update(){
            this.x -= this.game.speed;
            if(this.x <= -this.scaledWidth) {
                this.x=0;
            }
    }
    draw(){
        this.game.ctx.drawImage(this.img,this.x,0,this.scaledWidth,this.scaledHeight);
        this.game.ctx.drawImage(this.img,this.x+this.scaledWidth,0,this.scaledWidth,this.scaledHeight);
        if(this.game.canvas.width > this.scaledWidth){
            this.game.ctx.drawImage(this.img,this.x+this.scaledWidth*2,0,this.scaledWidth,this.scaledHeight);
        }
    }
    resize(){
        this.scaledWidth = this.width * this.game.ratio;
        this.scaledHeight = this.height * this.game.ratio;
        this.x=0;

    }
}