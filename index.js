// Import packages
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");

// Configuration
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const fnServeFiles = (req, res) => {
	switch (req.url) {
		case "/mock.html":
		case "/base.css":
			res.sendFile(path.join(__dirname, req.url.slice(1)));
			break;
		default:
			res.sendFile(INDEX);
			break;
	}
};

// Start server
const
server = express()
	// .use((req, res) => res.sendFile(INDEX))
    .use(express.static("static"))
	.use(fnServeFiles)
	.listen(PORT, () => console.log("Listening on localhost:" + PORT));

// Initiatlize SocketIO
const io = socketIO(server);

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('chatIn', function(msg){
        console.log('message: ' + msg);
        socket.emit("chatOut", msg)
    });
});