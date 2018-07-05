// Import packages
const express = require('express');
const path = require('path');

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
    console.log('a user connected');

    socket.on('disconnect', function () {
        console.log('user disconnected');
    });

    socket.on('chatIn', function (oMessage) {
        console.log(oMessage.username + ': ' + oMessage.text);
        io.emit('chatOut', oMessage)
    });

    socket.on('test', function() {
       io.emit('test');
    });
});



