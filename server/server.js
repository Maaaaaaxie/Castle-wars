// Import packages
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const ip = require('my-local-ip')();

// Import game engine
const game = require('./game.js');

game.start();

// Configuration
const PORT = process.env.PORT || 3000;

const _directory = __dirname.replace("\\server", "");

const INDEX = path.join(_directory, 'index.html');
const GAME = path.join(_directory, '/static/host/host.html');
const CONTROL = path.join(_directory, '/static/player/player.html');
const CHAT = path.join(_directory, '/static/chat/login.html');
const CARDS = path.join(_directory, '/static/data/cards.json');

// let game = {};

function fnRouting(req, res) {
    if (req.url === '/control') {
        res.sendFile(CONTROL);
    } else if (req.url === '/chatroom') {
        res.sendFile(CHAT);
    } else if (req.url === '/cards') {
        res.sendFile(CARDS)
    } else {
        res.sendFile(GAME);
    }
}

// Start server
const
    app = express()
        .use(express.static('static'))
        .use(fnRouting)
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
        const oPlayer = number === 1 ? game.player1 : game.player2;
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

    let iNumber;
    if (!game.player1) {
        iNumber = 1;
    } else if (!game.player2) {
        iNumber = 2;
    } else {
        console.warn("No client slot available");
        return;
    }

    game["player"+iNumber] = { id, socket };
    socket.join("player"+iNumber);
    socket.emit("join", iNumber);
    console.log("Player " + iNumber + " joined the game");
    updateClient("Spieler " + iNumber + " ist dem Spiel beigetreten");
}

function handleClientDisconnected(socket, id) {
    if (game.player1 && game.player1.id === id) {
        console.log("Player 1 left the game");
        socket.emit('leave');
        socket.leave('player1');
        game.player1 = undefined;
        updateClient("Spieler 1 hat das Spiel verlassen");
    } else if (game.player2 && game.player2.id === id) {
        console.log("Player 2 left the game");
        socket.emit('leave');
        socket.leave('player2');
        game.player2 = undefined;
        updateClient("Spieler 2 hat das Spiel verlassen");
    }
}

function updateClient(sMessage) {
    io.to('host').emit("clientUpdate", {
        player1: game.player1 && game.player1.id,
        player2: game.player2 && game.player2.id,
        message: sMessage
    });
}
