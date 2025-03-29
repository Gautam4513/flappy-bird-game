class AudioControl {
    constructor(){
        this.charge = document.getElementById("charge");
        this.flap1 = document.getElementById("flap1");
        this.flap2 = document.getElementById("flap2");
        this.flap3 = document.getElementById("flap3");
        this.flap4 = document.getElementById("flap4");
        this.flap5 = document.getElementById("flap5");
        this.win = document.getElementById("win");
        this.lose = document.getElementById("lose");
        this.moremoro = document.getElementById("moremoro");
        this.chakala = document.getElementById("chakala");
        this.flapSoundArray = [this.flap1,this.flap2,this.flap3,this.flap4,this.flap5]
    }
    play(...sounds){
        const playNext = (index)=>{
            if(index<sounds.length){
                const sound = sounds[index];
                sound.currentTime = 0;
                sound.play();
                sound.onended = () => playNext(index+1);

            }

        }
       playNext(0);
    }
}