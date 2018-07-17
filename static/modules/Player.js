const decks = require('../data/decks.json');
const that = this;
function getRandomCard() {
    if (!that.cards || that.cards.length === 0) {
        that.cards = decks[0].cards.slice(0);
    }
    const i = Math.round(Math.random() * (that.cards.length-1));
    const card = that.cards[i];
    that.cards.splice(i, 1);
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

    switchCard(id) {
        let index;
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].id === id) {
                index = i;
                break;
            }
        }
        this.cards.splice(index, 1);
        this.cards.push(getRandomCard());
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

        that.cards = decks[0].cards.slice(0);

        for (let i = 0; i < 8; i++) {
            this.cards.push(getRandomCard());
        }
    }
};