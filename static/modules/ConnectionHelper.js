const crypto = require('crypto');
const Player = require('./Player.js');

module.exports = class ConnectionHelper {
    constructor(game) {
        this.game = game;
        this.io = game.io;
        this.players = [];
    }

    handleClientConnected(socket) {
        const id = crypto.createHash("md5").update(socket.handshake.address).digest("hex");
        console.log('Client connected');

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
        }
        socket.emit("join", new Player(oPlayer));
        this.game["player"+number] = oPlayer;
        console.log("Player " + number + " joined the game");
        this.updateClient("Spieler " + number + " ist dem Spiel beigetreten");
    }

    handleClientDisconnected(socket, id) {
        if (this.game.player1 && this.game.player1.id === id) {
            console.log("Player 1 left the game");
            socket.emit('leave');
            this.game.player1 = undefined;
            this.updateClient("Spieler 1 hat das Spiel verlassen");
            // if (this.game.started) {
            //     this.startTimeoutCounter();
            // }
        } else if (this.game.player2 && this.game.player2.id === id) {
            console.log("Player 2 left the game");
            socket.emit('leave');
            this.game.player2 = undefined;
            this.updateClient("Spieler 2 hat das Spiel verlassen");
            // if (this.game.started) {
            //     this.startTimeoutCounter();
            // }
        }
    }

    handleHostDisconnected(socket) {
        socket.leave('host');
        console.log("Host disconnected");
    }

    updateClient(sMessage) {
        this.io.to("host").emit("clientUpdate", {
            player1: this.game.player1 && new Player(this.game.player1),
            player2: this.game.player2 && new Player(this.game.player2),
            message: sMessage
        });
    }

    startTimeoutCounter() {
        const iRemaining = 40000;
        this.io.emit("timeout", iRemaining);
    }
};
