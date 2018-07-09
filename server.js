// Import packages
const express = require('express');
const path = require('path');
const crypto = require('crypto');

// Configuration
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

// Start server
const
    app = express()
        .use(express.static('static'))
        .use((req, res) => res.sendFile(INDEX))
        .listen(PORT, () => console.log('Listening on localhost:' + PORT));

const io = require('socket.io')(app);

// Initiatlize SocketIO
io.on('connection', function (socket) {
    const id = crypto.createHash("md5").update(socket.handshake.address).digest("hex");
    console.log('User connected: ' + id);

    socket.on('disconnect', function () {
        const id = crypto.createHash("md5").update(socket.handshake.address).digest("hex");
        handleClientDisconnected(id);
        handleHostDisconnected(id);
        console.log('User disconnected: ' + id);
    });

    socket.on('chatIn', function (oMessage) {
        console.log(oMessage.username + ': ' + oMessage.text);
        io.emit('chatOut', oMessage)
    });

    socket.on('test', function() {
       io.emit('test');
    });

    socket.on('hostConnect', function() {
        const id = crypto.createHash("md5").update(socket.handshake.address).digest("hex");
        console.log('Host connected');
        handleHostConnected(id);
    });

    socket.on('clientConnect', function(username) {
        handleClientConnected(socket, username);
    });

    socket.on('clientKick', function(id) {
        handleClientDisconnected(id);
    });
});

function handleHostConnected(id) {
    if (!this._iHost) {
        this._iHost = id;
    } else {
        console.warn("Game is already hosted");
    }
}

function handleHostDisconnected(id) {
    if (this._iHost === id) {
        console.log("Host disconnected");
        this._iHost = undefined;
    }
}

function handleClientConnected(socket) {
    const id = crypto.createHash("md5").update(socket.handshake.address).digest("hex");
    console.log('Client connected');

    if (!this._iPlayer1) {
        this._iPlayer1 = id;
        socket.join("player1");
        console.log("Player 1 joined the game");
        updateClient("Spieler 1 ist dem Spiel beigetreten");
    } else if (!this._iPlayer2) {
        this._iPlayer2 = id;
        socket.join("player2");
        console.log("Player 2 joined the game");
        updateClient("Spieler 2 ist dem Spiel beigetreten");
    } else {
        console.warn("No client slot available");
    }
}

function handleClientDisconnected(id) {
    if (this._iPlayer1 === id) {
        console.log("Removed player 1");
        this._iPlayer1 = undefined;
        updateClient("Spieler 1 hat das Spiel verlassen");
    } else if (this._iPlayer2 === id) {
        console.log("Removed player 2");
        this._iPlayer2 = undefined;
        updateClient("Spieler 2 hat das Spiel verlassen");
    }
}

function updateClient(msg) {
    io.emit("clientUpdate", {
        player1: this._iPlayer1,
        player2: this._iPlayer2,
        message: msg
    });
}


