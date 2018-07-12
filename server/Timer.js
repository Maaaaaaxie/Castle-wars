module.exports = class Timer {
    constructor(callback, delay) {
        let iTimerId, oStart, iRemaining = delay;

        this.pause = function() {
            window.clearTimeout(iTimerId);
            iRemaining -= new Date() - oStart;
        };

        this.resume = function() {
            oStart = new Date();
            clearTimeout(iTimerId);
            iTimerId = setTimeout(callback, iRemaining);
        };

        this.resume();
    }
}