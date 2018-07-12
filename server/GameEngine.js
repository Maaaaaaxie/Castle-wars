const Player = require('./Player.js');
const Timer = require('./Timer.js');
const cards = require('../static/data/cards.json');

module.exports = class GameEngine {
    constructor(io) {
        this.io = io;
    }

    start() {
        if (!this.started) {
            this.started = true;
            this.initializePlayer(this.player1);
            this.initializePlayer(this.player2);
            console.log("Started game");
            this.io.emit("start");
            this.nextRound();
        }
    }

    resume() {
        if (this.started) {
            this.paused = false;
            this.getActivePlayer().timer.resume();
        }
    }

    pause() {
        if (this.started) {
            this.paused = true;
            this.getActivePlayer().timer.pause();
        }
    }

    restart() {
        //TODO
    };

    quit() {
        if (this.started) {
            this.started = false;
            console.log("Quited game");
            this.player1 = undefined;
            this.player2 = undefined;
        }
    }

    getActivePlayer() {
        return [this.player1, this.player2].filter(e => e.active)[0];
    }

    initializePlayer(player) {
        class FrontendPlayer {
            constructor(oDef) {
                this.castle = oDef.castle;
                this.fence = oDef.fence;
                this.builder = oDef.builder;
                this.stones = oDef.stones;
                this.soldiers = oDef.soldiers;
                this.weapons = oDef.weapons;
                this.mages = oDef.mages;
                this.crystals = oDef.crystals;
            }
        }

        const game = this;
        player.timer = new Timer(() => {
            player.done = true;
            if (game.getWinner()) {
                game.finish(game.getWinner());
            } else {
                game.nextRound();
            }
        }, 120000);

        player.socket.on('card', id => {
            if (player.active) {
                this.activateCard(id, player);

                const oPlayer1 = new FrontendPlayer(this.player1);
                const oPlayer2 = new FrontendPlayer(this.player2);

                this.io.to('host').emit('playerUpdate', [ oPlayer1, oPlayer2 ]);
                player.done = true;
                player.timer.finish();
            }
        });
    }

    nextRound() {
        let player;
        if (this.player1.active) {
            player = this.player2;
            this.player1.active = false;
        } else {
            player = this.player1;
            this.player2.active = false;
        }

        player.active = true;
        player.done = false;
        player.socket.emit('turn');
        player.timer.start();
    }

    /**
     * Determines and returns the player who has won
     * @returns {Player || undefined}
     */
    getWinner() {
        if (this.player1.castle === 0) {
            return this.player2;
        } else if (this.player1.castle === 100) {
            return this.player1;
        } else if (this.player2.castle === 0) {
            return this.player1;
        } else if (this.player2.castle === 100) {
            return this.player2;
        }
    }

    finish(winner) {
        const sNumber = winner === this.player1 ? "1" : "2";
        this.io.to('host').emit('toast', "Spieler " + sNumber + " hat das Spiel gewonnen");
    }

    activateCard(id, player) {
        const card = cards.filter(e => e.id === id)[0];
        const enemy = player === this.player1 ? this.player2 : this.player1;

        const aSelf = Object.keys(card.self);
        const aEnemy = Object.keys(card.enemy);
        const aCosts = Object.keys(card.costs);

        aSelf.forEach(e => player[e] += card.self[e]);
        aCosts.forEach(e => player[e] += card.costs[e]);
        aEnemy.forEach(e => {
            if (e === "health") {
                if (enemy.fence + card.enemy.health < 0) {
                    const iCastle = enemy.fence + card.enemy.health;
                    enemy.fence = 0;
                    enemy.castle += iCastle;
                } else {
                    enemy.fence += card.enemy.health;
                }
            } else {
                enemy[e] += card.enemy[e];
            }
        });
    }
};

