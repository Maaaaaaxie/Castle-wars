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
    handlePlayerConnected(id);

    io.emit("userConnected", { id: id, player: 1 });

    socket.on('disconnect', function () {
        const id = crypto.createHash("md5").update(socket.handshake.address).digest("hex");
        handlePlayerDisconnected(id);
        console.log('User disconnected: ' + id);
    });

    socket.on('chatIn', function (oMessage) {
        console.log(oMessage.username + ': ' + oMessage.text);
        io.emit('chatOut', oMessage)
    });

    socket.on('test', function() {
       io.emit('test');
    });
});


function handlePlayerConnected(id) {
    if (!this._iPlayer1) {
        this._iPlayer1 = id;
    } else if (!this._iPlayer2) {
        this._iPlayer2 = id;
    } else {
        console.warn("No slot available");
    }
}

function handlePlayerDisconnected(id) {
    if (this._iPlayer1 === id) {
        this._iPlayer1 = undefined;
        delete this._iPlayer1;
    } else if (this._iPlayer2 === id) {
        this._iPlayer2 = undefined;
        delete this._iPlayer2;
    }
}


