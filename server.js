// Import packages
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const ip = require('my-local-ip')();

// Configuration
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
const GAME = path.join(__dirname, '/static/game/game.html');
const CONTROL = path.join(__dirname, '/static/player/player.html');
const CHAT = path.join(__dirname, '/static/chat/login.html');

let game = {};

// Start server
const
    app = express()
        .use(express.static('static'))
        .use((req, res) => {
            if (req.url === '/control') {
                res.sendFile(CONTROL);
            } else if (req.url === '/chatroom') {
                res.sendFile(CHAT);
            } else {
                res.sendFile(GAME);
            }
        })
        .listen(PORT, () => console.log('Listening on localhost:' + PORT));

const io = require('socket.io')(app);

// Initiatlize SocketIO
io.on('connection', function (socket) {
    // -------- general ------------------------------------------------------------------------------------------------
    const id = crypto.createHash("md5").update(socket.handshake.address).digest("hex");
    console.log('User connected: ' + id);

    socket.on('disconnect', function () {
        const id = crypto.createHash("md5").update(socket.handshake.address).digest("hex");
        handleClientDisconnected(socket, id);
        handleHostDisconnected(socket);
        console.log('User disconnected: ' + id);
    });

    // -------- chat ---------------------------------------------------------------------------------------------------
    socket.on('chatIn', function (oMessage) {
        console.log(oMessage.username + ': ' + oMessage.text);
        io.emit('chatOut', oMessage)
    });

    // -------- game ---------------------------------------------------------------------------------------------------
    socket.on('hostConnect', function() {
        socket.join('host');
        socket.emit('init', ip + ":" + PORT);
        updateClient();
        console.log('Host connected');
    });

    socket.on('clientConnect', function(username) {
        handleClientConnected(socket, username);
    });

    socket.on('clientKick', function(number) {
        console.log("Player " + number + " was kicked");
        const oPlayer = number === 1 ? game._oPlayer1 : game._oPlayer2;
        handleClientDisconnected(oPlayer.socket, oPlayer.id);
    });
});

function handleHostDisconnected(socket) {
    socket.leave('host');
    console.log("Host disconnected");
}

function handleClientConnected(socket) {
    const id = crypto.createHash("md5").update(socket.handshake.address).digest("hex");
    console.log('Client connected');

    if (!game._oPlayer1) {
        game._oPlayer1 = {
            id,
            socket
        };
        socket.join("player1");
        console.log("Player 1 joined the game");
        updateClient("Spieler 1 ist dem Spiel beigetreten");
    } else if (!game._oPlayer2) {
        game._oPlayer2 = {
            id,
            socket
        };
        socket.join("player2");
        console.log("Player 2 joined the game");
        updateClient("Spieler 2 ist dem Spiel beigetreten");
    } else {
        console.warn("No client slot available");
    }
}

function handleClientDisconnected(socket, id) {
    if (game._oPlayer1 && game._oPlayer1.id === id) {
        console.log("Player 1 left the game");
        socket.leave('player1');
        game._oPlayer1 = undefined;
        updateClient("Spieler 1 hat das Spiel verlassen");
    } else if (game._oPlayer2 && game._oPlayer2.id === id) {
        console.log("Player 2 left the game");
        socket.leave('player2');
        game._oPlayer2 = undefined;
        updateClient("Spieler 2 hat das Spiel verlassen");
    }
}

function updateClient(sMessage) {
    io.to('host').emit("clientUpdate", {
        player1: game._oPlayer1 && game._oPlayer1.id,
        player2: game._oPlayer2 && game._oPlayer2.id,
        message: sMessage
    });
}


