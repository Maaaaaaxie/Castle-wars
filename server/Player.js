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
    }
};