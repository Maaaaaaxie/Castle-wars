class Player {
    constructor(id, x, sColor) {
        this.id = id;

        const oInit = that._oInitialValues;
        this.health = oInit.health;
        this._set("castle", oInit.health);

        this.stones = oInit.stones;
        this._set("stones", oInit.stones);
        this.builders = oInit.builders;
        this._set("builders", oInit.builders);

        this.weapons = oInit.weapons;
        this._set("weapons", oInit.weapons);
        this.soldiers = oInit.soldiers;
        this._set("soldiers", oInit.soldiers);

        this.crystals = oInit.crystals;
        this._set("crystals", oInit.crystals);
        this.mages = oInit.mages;
        this._set("mages", oInit.mages);

        this.castle = {
            x: x,
            color: sColor,
            height: this.health
        }
    }

    setColor(sColor) {
        this.castle.color = sColor;
    }

    setBuilders(i) {
        this.builders = i;
        this._set("builders", i);
    }

    setStones(i) {
        this.stones = i;
        this._set("stones", i);
    }

    setSoldiers(i) {
        this.soldiers = i;
        this._set("soldiers", i);
    }

    setWeapons(i) {
        this.weapons = i;
        this._set("weapons", i);
    }

    setMages(i) {
        this.mages = i;
        this._set("mages", i);
    }

    setCrystals(i) {
        this.crystals = i;
        this._set("crystals", i);
    }

    setHealth(iHealth) {
        if (iHealth < 0) {
            iHealth = 0;
        } else if (iHealth > 400) {
            iHealth = 400;
        }

        this.health = iHealth;
        this._set("castle", iHealth);
        _setCastleHeight(this.id, iHealth);
    }

    //TODO integrate fence
    // setFence(i) {
    //     this.fence = i;
    //     this._set("fence", i);
    // }

    _set(sProperty, iValue) {
        document.getElementById("stats-"+this.id).getElementsByClassName(sProperty)[0].innerText = iValue;
        document.getElementById("info-"+this.id).getElementsByClassName(sProperty)[0].innerText = iValue;
    }
}