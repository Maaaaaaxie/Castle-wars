const crypto = require("crypto");
const Player = require("./Player.js");

module.exports = class ConnectionHelper {
    constructor(game) {
        this.game = game;
        this.io = game.io;
        this.players = [];
    }

    handleClientConnect(socket, id) {
        let number;
        if (!this.game.player1) {
            number = 1;
        } else if (!this.game.player2) {
            number = 2;
        } else {
            console.warn("No client slot available");
            return;
        }

        let oPlayer = this.players.find(e => e.id === id);

        if (!oPlayer) {
            oPlayer = new Player({id, number, socket}, true, true);
            this.players.push(oPlayer);
        } else if (!this.game.started) {
            oPlayer.number = number;
        }

        this.game.addPlayer(oPlayer);

        console.log("Player " + number + " joined the game");
        this.io.emit("toast", "Spieler " + number + " ist dem Spiel beigetreten");
    }

    handleClientDisconnected(socket, number) {
        this.game.removePlayer(number);
        socket.emit("leave");

        if (this.game.started) {
            this.game.pause();
        }

        console.log("Player " + number + " left the game");
        this.io.emit("toast", "Spieler " + number + " hat das Spiel verlassen");
    }
};
