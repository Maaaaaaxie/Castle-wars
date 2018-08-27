// Import packages
const express = require("express");
const path = require("path");
const crypto = require("crypto");
const ip = require("my-local-ip")();

// Configuration
const PORT = process.env.PORT || 3000;

const INDEX = path.join(__dirname, "index.html");
const GAME = path.join(__dirname, "/static/host/host.html");
const CONTROL = path.join(__dirname, "/static/player/complete/index.html");
const CHAT = path.join(__dirname, "/static/chat/login.html");
const CARDS = path.join(__dirname, "/static/data/cards.json");

// let game = {};

function fnRouting(req, res) {
    if (req.url === "/control") {
        res.sendFile(CONTROL);
    } else if (req.url === "/chatroom") {
        res.sendFile(CHAT);
    } else if (req.url === "/cards") {
        res.sendFile(CARDS)
    } else {
        res.sendFile(GAME);
    }
}

// Start server
const
    app = express()
        .use(express.static("static"))
        .use(fnRouting)
        .listen(PORT, () => console.log("Listening on localhost:" + PORT));

const io = require("socket.io")(app);

// Initialize game
const GameEngine = require("./static/modules/Game.js");
const game = new GameEngine(io);

// Initialize connection helper
const ConnectionHelper = require("./static/modules/ConnectionHelper.js");
const connection = new ConnectionHelper(game);

// initialize SocketIO
io.on("connection", function(socket) {
    // -------- general ------------------------------------------------------------------------------------------------
    const id = crypto.createHash("md5").update(socket.handshake.address).digest("hex");
    // console.log("User connected: " + id);

    socket.on("connect", sType => {
        if (sType === "client") {
            console.log("Client connected: " + id);
            connection.handleClientConnect(socket, id);
        } else if (sType === "host") {
            console.log("Host connected: " + id);
            socket.join("host")
        } else {
            throw new Error("User type '" + sType + "' unknown.");
        }

        io.emit("init", {
            id: id,
            game: game.toFrontendStructure(),
            players: game.getPlayers(),
            ip: ip + ":" + PORT
        });
    });

    socket.on("disconnect", () => {
        const id = crypto.createHash("md5").update(socket.handshake.address).digest("hex");
        connection.handleClientDisconnected(socket, id);
        connection.handleHostDisconnected(socket);
        console.log("User disconnected: " + id);
    });

    // -------- chat ---------------------------------------------------------------------------------------------------
    socket.on("chatIn", oMessage => {
        console.log(oMessage.username + ": " + oMessage.text);
        io.emit("chatOut", oMessage);
    });

    // -------- game ---------------------------------------------------------------------------------------------------
    socket.on("clientConnect", username => {
        connection.handleClientConnect(socket, username);
    });

    socket.on("clientKick", number => {
        if(game.started) {
            console.log("Players can't be kicked while a game is runninng");
            io.to("host").emit("toast", "Spieler können während einem Spiel nicht gekickt werden");
            return;
        }
        const oPlayer = number === 1 ? game.player1 : game.player2;
        connection.handleClientDisconnected(oPlayer.socket, oPlayer.id);
        console.log("Player " + number + " was kicked");
    });

    socket.on("start", () => {
        game.start();
    });

    socket.on("pause", () => {
        if (!game.paused) {
            game.pause();
        } else {
            game.resume();
        }
    });

    socket.on("quit", () => {
        game.quit();
    });
});


