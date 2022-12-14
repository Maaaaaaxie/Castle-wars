// Import packages
const express = require("express");
const path = require("path");
const crypto = require("crypto");
const ip = require("my-local-ip")();
const qr = require("qr-image");

// Configuration
const PORT = process.env.PORT || 80;
const sLink = "http://" + ip + "/control";
const code = qr.imageSync(sLink, { type: 'png', size: 20 });

const INDEX = path.join(__dirname, "index.html");
const GAME = path.join(__dirname, "/static/host/host.html");
const CONTROL = path.join(__dirname, "/static/player/index.html");
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
    } else if (req.url === "/qr") {
        res.setHeader('Content-type', 'image/png');  //sent qr image to client side
        res.send(code);
    } else {
        res.sendFile(GAME);
    }
}

// Start server
const
    app = express()
        .use(express.static("static"))
        .use(fnRouting)
        .listen(PORT, () => console.log("Listening on " + ip + ":" + PORT + "\n." + "\n." + "\n.\n"));

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
            link: sLink
        });
    }

    socket.on("connected", sType => {
        if (sType === "host") {
            console.log("Host connected: " + id);
            socket.join("host");
            sendInfoTo(socket);
        } else {
            console.log("Client connected: " + id);
            socket.emit("init", {
                id,
                state: game.getState()
            });

            const oPlayer = connection.players.find(e => e.id === id);
            if (!!oPlayer) {
                oPlayer.connected = true;
                oPlayer.socket = socket;
                if (game.started) {
                    game.initializeCardListener(oPlayer);
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


