const Player = require("./Player.js");
const Timer = require("./Timer.js");

const cards = require("../data/cards.json");

module.exports = class GameEngine {
    constructor(io) {
        this.io = io;
        this.started = false;
        this.paused = false;

        this.turnLength = 40;

        this.states = {
            READY: "ready",
            RUNNING: "running",
            BLOCKED: "blocked",
            PAUSED: "paused"
        }
    }

    toFrontendStructure() {
        return {
            active: this.getActive(),
            state: this.getState()
        }
    }

    getState() {
        if (this.paused) {
            return this.states.PAUSED;
        } else if (this.started) {
            return this.states.RUNNING;
        } else if (this.player1 && this.player1.connected && this.player2 && this.player2.connected) {
            return this.states.READY;
        } else {
            return this.states.BLOCKED;
        }
    }

    start() {
        if (!this.started) {
            this.started = true;
            this.initializePlayer(this.player1);
            this.initializePlayer(this.player2);
            console.log("Started game");
            this.io.to("host").emit("toast", "Das Spiel wurde gestartet");
            this.io.emit("start");
            this.nextRound();
        }
    }

    resume() {
        if (this.started) {
            console.log("Resumed");
            this.paused = false;
            this.io.emit("pause", {
                active: this.getActive(),
                paused: false,
                remaining: Math.round(this.getActivePlayer().timer.remaining / 1000)
            });
            if (this.getActivePlayer()) {
                this.getActivePlayer().timer.resume();
            }
        }
    }

    pause() {
        if (this.started) {
            console.log("Paused");
            this.paused = true;
            this.io.emit("pause", {
                paused: true
            });
            if (this.getActivePlayer()) {
                this.getActivePlayer().timer.pause();
            }
        }
    }

    quit() {
        if (this.started) {
            this.started = false;
            this.paused = false;
            console.log("Quited game");
            this.io.to("host").emit("toast", "Das Spiel wurde beendet");
            this.io.emit("quit");

            if (this.player1) {
                this.player1.active = undefined;
                this.player1.reset();
                this.player1.timer.stop();
            }

            if (this.player2) {
                this.player2.active = undefined;
                this.player2.reset();
                this.player2.timer.stop();
            }
        }
    }

    getActivePlayer() {
        if (this.started) {
            return [this.player1, this.player2].filter(e => e && e.active)[0];
        }
    }

    getActive() {
        if (this.getActivePlayer()) {
            return this.getActivePlayer().number;
        }
    }

    initializePlayer(player) {
        const callback = function () {
            player.done = true;
            player.socket.emit("done");
            if (this.getWinner()) {
                this.finish(this.getWinner());
            } else {
                this.nextRound();
            }
        };

        player.timer = new Timer(callback.bind(this), this.turnLength * 1000);

        this.initializeCardListener(player);
    }

    initializeCardListener(player) {
        if (!player.bCardListenerSet) {
            player.bCardListenerSet = true;
            player.socket.on("card", o => {
                if (player.active) {
                    this.io.emit("cardAnimation", {
                        discard: o.discard,
                        id: o.id,
                        number: player.number
                    });

                    if (!o.discard) {
                        this.activateCard(o.id, player);
                    } else {
                        player.switchCard(o.id);
                    }
                    player.done = true;
                    this.sendPlayerInfo();
                    player.timer.finish();
                }
            });
        }
    }

    nextRound() {
        if (!this.iNextRound) {
            this.iNextRound = setTimeout(() => {
                if (!this.player1 || !this.player1.connected || !this.player2 || !this.player2.connected) {
                    console.error("The player object is undefined! A Player might has been disconnected");
                    this.pause();
                    this.iNextRound = undefined;
                    return;
                }

                let player;
                if (this.player1.active) {
                    player = this.player2;
                    this.player1.active = false;
                } else {
                    player = this.player1;
                    this.player2.active = false;
                }

                if (player) {
                    player.addResources();
                    this.sendPlayerInfo();
                    player.active = true;
                    player.done = false;

                    this.io.emit("turn", {
                        active: player.number,
                        duration: this.turnLength
                    });

                    player.timer.start();
                    console.log("Player " + player.number + " turn");
                }
                clearTimeout(this.iNextRound);
                this.iNextRound = undefined;
            }, 800);
        }
    }

    /**
     * Determines and returns the player who has won
     * @returns {Player || undefined}
     */
    getWinner() {
        if (this.player1 && this.player2) {
            if (this.player1.castle <= 0) {
                return this.player2;
            } else if (this.player1.castle >= 100) {
                return this.player1;
            } else if (this.player2.castle <= 0) {
                return this.player1;
            } else if (this.player2.castle >= 100) {
                return this.player2;
            }
        }
    }

    finish(winner) {
        const sNumber = winner.number;
        this.io.emit("finish", {
            number: winner.number,
            message: "Spieler " + sNumber + " hat das Spiel gewonnen"
        });
    }

    activateCard(id, player) {
        const card = cards.filter(e => e.id === id)[0];
        player.switchCard(id);

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
                if (!card.enemy) {
                    console.warn(card);
                }
                enemy[e] += card.enemy[e];
            }

            if (enemy[e] < 0) {
                enemy[e] = 0;
            }
        });
    }

    getPlayers() {
        const arr = [];
        if (this.player1) {
            arr.push(new Player(this.player1));
        }
        if (this.player2) {
            arr.push(new Player(this.player2));
        }
        return arr;
    }

    addPlayer(o) {
        this["player" + o.number] = o;
    }

    removePlayer(number) {
        if (!this.started) {
            this["player" + number] = undefined;
        }
    }

    sendPlayerInfo() {
        this.io.emit("playerUpdate", [
            new Player(this.player1),
            new Player(this.player2)
        ]);
    }
};

