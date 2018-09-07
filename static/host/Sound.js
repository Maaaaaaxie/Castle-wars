class Sound {
    constructor(src, volume, bRemove = true, bLoop = false) {
        this.audio = document.createElement("audio");
        this.audio.loop = bLoop;
        this.audio.src = src;
        this.audio.volume = volume || 0.5;
        this.audio.muted = window.muted;

        if (!window.sounds) {
            window.sounds = [];
        }

        window.sounds.push(this);

        if (bRemove) {
            this.audio.addEventListener("ended", () => this.destruct())
        }
    }

    play() {
        this.audio.play();
    }

    stop() {
        this.audio.stop();
    }

    destruct() {
        const index = window.sounds.indexOf(this);
        window.sounds.splice(index, 1);
    }

    set volume(volume) {
        this.audio.volume = volume;
    }

    get volume() {
        return this.audio.volume;
    }

    set muted(b) {
        this.audio.muted = b;
    }
}