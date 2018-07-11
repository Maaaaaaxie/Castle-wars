class Sound {
    constructor(sSrc, fVolume = 0.5, bLoop = false) {
        this.sound = document.createElement("audio");
        this.sound.src = sSrc;
        this.sound.volume = fVolume;
        this.sound.loop = bLoop;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
            this.sound.play();
        };
        this.stop = function(){
            this.sound.pause();
        };
        this.mute = function() {
            this.sound.muted = !this.sound.muted;
        };
        this.volume = function(f) {
            this.sound.volume = f;
        };
    }
}