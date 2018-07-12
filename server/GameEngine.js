const Player = require('./Timer.js');

module.exports = class GameEngine {
    constructor(io) {
        this.io = io;
    }

    start() {
        console.log("Started game");
        this.nextRound();
    }

    pause() {
        this.paused = true;
    }

    restart() {
        //TODO
    };

    quit() {
        console.log("Quited game");
        this.player1 = undefined;
        this.player2 = undefined;
    }

    initializeSockets(player) {
        player.socket.on('card', obj => {
            if (player.active) {
                player.done = true;
            }
        });
    }

    nextRound() {
        let player;
        if (this.activePlayer === 1) {
            this.activePlayer = 2;
            player = this.player2;
        } else {
            this.activePlayer = 1;
            player = this.player1;
        }
        player.active = true;
        player.done = false;

        player.socket.emit('turn');

        let i = 0;
        const iInterval = setInterval(() => {
            i++;
            if (i < 30 || player.done) {
                clearInterval(iInterval);
                player.done = true;
                if (this.getWinner()) {
                    this.finish(this.getWinner());
                } else {
                    player.active = false;
                    this.nextRound();
                }
            }
        }, 1000);
    }

    /**
     * Determines and returns the player who has won
     * @returns {Player || undefined}
     */
    getWinner() {
        if (this.player1.health === 0) {
            return this.player2;
        } else if (this.player1.health === 100) {
            return this.player1;
        } else if (this.player2.health === 0) {
            return this.player1;
        } else if (this.player2.health === 100) {
            return this.player2;
        }
    }

    finish(winner) {
        const sNumber = winner === this.player1 ? "1" : "2";
        io.to('host').emit('toast', "Spieler " + sNumber + " hat das Spiel gewonnen");
    }
};

