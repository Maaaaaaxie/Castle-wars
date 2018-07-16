const cards = require('../static/data/cards.json');

function getRandomCard() {
    if (!this.cards || this.cards.length === 0) {
        this.cards = cards.slice(0);
    }
    const i = Math.round(Math.random() * (this.cards.length-1));
    const card = this.cards[i].id;
    this.cards.splice(i, 1);
    return card;
}

module.exports = class Player {
    constructor(oDef, bSocket = false, bInitial = false) {
        this.id = oDef.id;
        this.number = oDef.number;
        this.color = oDef.color;

        if (bSocket) {
            this.socket = oDef.socket;
        }

        if (bInitial) {
            this.reset();
        } else {
            this.castle = oDef.castle;
            this.fence = oDef.fence;
            this.stones = oDef.stones;
            this.builders = oDef.builders;
            this.weapons = oDef.weapons;
            this.soldiers = oDef.soldiers;
            this.crystals = oDef.crystals;
            this.mages = oDef.mages;
            this.cards = oDef.cards;
        }
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
        this.cards = [];

        for (let i = 0; i < 8; i++) {
            this.cards.push(getRandomCard());
        }
    }
};