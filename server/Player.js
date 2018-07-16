module.exports = class Player {
    constructor(id, iNumber, socket, sColor) {
        this.id = id;
        this.number = iNumber;
        this.socket = socket;
        this.color = sColor;
        this.reset();
    }

    reset() {
        this.castle = 20;
        this.fence = 10;
        this.stones = 8;
        this.builders = 2;
        this.weapons = 8;
        this.soldiers = 2;
        this.crystals = 8;
        this.mages = 2;
    }
};