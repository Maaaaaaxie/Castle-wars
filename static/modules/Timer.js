module.exports = class Timer {
    constructor(callback, delay) {
        this.callback = callback;
        this.delay = delay;
        this.begin = new Date();
        this.remaining = delay;
    }

    start() {
        this.remaining = this.delay;
        this.resume();
    }

    stop() {
        clearTimeout(this.id);
        this.remaining = this.delay;
    }

    pause() {
        clearTimeout(this.id);
        this.remaining -= new Date() - this.begin;
    }

    resume() {
        clearTimeout(this.id);
        this.begin = new Date();
        this.id = setTimeout(this.callback, this.remaining);
    }

    finish() {
        this.stop();
        this.callback();
    }
};