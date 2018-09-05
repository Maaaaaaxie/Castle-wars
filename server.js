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
const DATENSCHUTZ = path.join(__dirname, "/static/legal/privacy.html");
const IMPRESSUM = path.join(__dirname, "/static/legal/impress.html");

// let game = {};

function fnRouting(req, res) {
    if (req.url === "/control") {
        res.sendFile(CONTROL);
    } else if (req.url === "/chatroom") {
        res.sendFile(CHAT);
    } else if (req.url === "/cards") {
        res.sendFile(CARDS)
    } else if (req.url === "/datenschutz") {
        res.sendFile(DATENSCHUTZ);
    } else if (req.url === "/impressum") {
        res.sendFile(IMPRESSUM);
    } else {
        res.sendFile(GAME);
    }
}

// Start server
const
    app = express()
        .use(express.static("static"))
        .use(fnRouting)
        .listen(PORT, () => console.log("Listening on " + ip + ":" + PORT));

const io = require("socket.io")(app);

// Initialize game
const GameEngine = require("./static/modules/Game.js");
const game = new GameEngine(io);

// Initialize connection helper
const ConnectionHelper = require("./static/modules/ConnectionHelper.js");
const connection = new ConnectionHelper(game);


// initialize SocketIO
io.on("connection", function (socket) {
    const id = crypto.createHash("md5").update(socket.handshake.address).digest("hex");

    function sendInfoTo(context) {
        context.emit("info", {
            game: game.toFrontendStructure(),
            players: game.getPlayers(),
            ip: ip + ":" + PORT
        });
    }

    socket.on("connected", sType => {
        if (sType === "host") {
            console.log("Host connected: " + id);
            socket.join("host");
            sendInfoTo(io.to(socket));
        } else {
            console.log("Client connected: " + id);
            socket.emit("init", {
                id,
                state: game.getState()
            });

            const oPlayer = connection.players.find(e => e.id === id);
            if (!!oPlayer) {
                oPlayer.connected = true;
                if (game.started) {
                    sendInfoTo(io.sockets);
                }
            }

            if (game.interrupted) {
                if (game.getPlayers().filter(e => e.connected).length === 2) {
                    setTimeout(() => game.resume(), 700);
                }
            }
        }
    });

    socket.on("join", () => {
        connection.handleClientJoin(socket, id, () => sendInfoTo(io.sockets));
    });

    socket.on("disconnect", () => {
        const oPlayer = connection.players.find(e => e.id === id);

        if (oPlayer) {
            setTimeout(() => connection.handleClientDisconnected(oPlayer, () => sendInfoTo(io.to("host"))), 200);
        } else {
            socket.leave("host"); // could happen that socket never joined 'host' but shouldn't be a problem
        }
    });

    socket.on("kick", number => {
        if (game.started) {
            console.log("Players can't be kicked while a game is runninng");
            io.to("host").emit("toast", "Spieler können während einem Spiel nicht gekickt werden");
            return;
        }
        const oPlayer = number === 1 ? game.player1 : game.player2;
        console.log("Player " + number + " was kicked");
        connection.handleClientDisconnected(oPlayer, () => sendInfoTo(io.to("host")));
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


