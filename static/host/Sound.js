class Sound {
    constructor(src, volume_offset = 0, bRemove = true, bLoop = false) {
        this.audio = document.createElement("audio");
        this.audio.loop = bLoop;
        this.audio.src = src;
        this.volume_offset = volume_offset;
        this.audio.volume = window.volume_sounds + volume_offset;
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
        const vol = volume + this.volume_offset;
        this.audio.volume = vol >= 0 ? vol : 0;
    }

    get volume() {
        return this.audio.volume;
    }

    set muted(b) {
        this.audio.muted = b;
    }
}