module.exports = class GameEngine {
    static start(id1, id2) {
        console.log("Started game");
    }

    static quit() {
        console.log("Quited game");
        this.player1 = undefined;
        this.player2 = undefined;
    }
};
