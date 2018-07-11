const Player = require('./Player.js');

module.exports = {
    start,
    quit,
    player1: new Player(),
    player2: new Player()
}

function start() {
    console.log("Started game");
}

function quit() {

}

