const crypto = require('crypto');
const Player = require('./Player.js');

module.exports = class ConnectionHelper {
    constructor(game) {
        this.game = game;
        this.io = game.io;
    }

    handleClientConnected(socket) {
        const id = crypto.createHash("md5").update(socket.handshake.address).digest("hex");
        console.log('Client connected');

        let iNumber;
        if (!this.game.player1) {
            iNumber = 1;
        } else if (!this.game.player2) {
            iNumber = 2;
        } else {
            console.warn("No client slot available");
            return;
        }

        this.game["player"+iNumber] = new Player(id, iNumber, socket);
        socket.emit("join", iNumber);
        console.log("Player " + iNumber + " joined the game");
        this.updateClient("Spieler " + iNumber + " ist dem Spiel beigetreten");
        this.checkReady();
    }

    handleClientDisconnected(socket, id) {
        if (this.game.player1 && this.game.player1.id === id) {
            console.log("Player 1 left the game");
            socket.emit('leave');
            this.game.player1 = undefined;
            this.updateClient("Spieler 1 hat das Spiel verlassen");
        } else if (this.game.player2 && this.game.player2.id === id) {
            console.log("Player 2 left the game");
            socket.emit('leave');
            this.game.player2 = undefined;
            this.updateClient("Spieler 2 hat das Spiel verlassen");
        }
    }

    handleHostDisconnected(socket) {
        socket.leave('host');
        console.log("Host disconnected");
    }

    updateClient(sMessage) {
        const oPlayer1 = this.game.player1 ? Object.assign({}, this.game.player1) : undefined;
        const oPlayer2 = this.game.player2 ? Object.assign({}, this.game.player2) : undefined;
        if (oPlayer1) {
            delete oPlayer1.socket;
        }
        if (oPlayer2) {
            delete oPlayer2.socket;
        }

        this.io.to('host').emit("clientUpdate", {
            player1: oPlayer1,
            player2: oPlayer2,
            message: sMessage
        });
    }

    checkReady() {
        this.game.ready = this.game.player1 && this.game.player2;
    }
};
