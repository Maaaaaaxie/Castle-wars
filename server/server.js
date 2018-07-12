// Import packages
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const ip = require('my-local-ip')();

// Initialize game
const GameEngine = require('./GameEngine.js');
const game = new GameEngine;

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

// Initialize connection helper
const ConnectionHelper = require('./ConnectionHelper.js');
const connection = new ConnectionHelper(game, io);

// Initiatlize SocketIO
io.on('connection', function (socket) {
    // -------- general ------------------------------------------------------------------------------------------------
    const id = crypto.createHash("md5").update(socket.handshake.address).digest("hex");
    console.log('User connected: ' + id);

    socket.on('disconnect', function () {
        const id = crypto.createHash("md5").update(socket.handshake.address).digest("hex");
        connection.handleClientDisconnected(socket, id);
        connection.handleHostDisconnected(socket);
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
        connection.updateClient();
        console.log('Host connected');
    });

    socket.on('clientConnect', function(username) {
        connection.handleClientConnected(socket, username);
    });

    socket.on('clientKick', function(number) {
        console.log("Player " + number + " was kicked");
        const oPlayer = number === 1 ? game.player1 : game.player2;
        connection.handleClientDisconnected(oPlayer.socket, oPlayer.id);
    });

    socket.on('start', function() {
        game.start();
    });
});


