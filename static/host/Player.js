class Player {
    constructor(oDef) {
        this.number = oDef.number;

        this.health = oDef.health;
        this._set("castle", oDef.health);

        this.fence = oDef.fence;
        this._set("fence", oDef.fence);

        this.stones = oDef.stones;
        this._set("stones", oDef.stones);
        this.builders = oDef.builders;
        this._set("builders", oDef.builders);

        this.weapons = oDef.weapons;
        this._set("weapons", oDef.weapons);
        this.soldiers = oDef.soldiers;
        this._set("soldiers", oDef.soldiers);

        this.crystals = oDef.crystals;
        this._set("crystals", oDef.crystals);
        this.mages = oDef.mages;
        this._set("mages", oDef.mages);

        this.castle = {
            color: oDef.color,
            height: this.health * that._iModifier,
            fence: {
                height: this.fence * that._iModifier
            }
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
        } else if (iHealth >= 100) {
            iHealth = 100;
        }

        this.health = iHealth;
        this._set("castle", iHealth);
        _setCastleHeight(this.id, iHealth * that._iModifier);
    }

    setFence(iHeight) {
        this.fence = iHeight;
        this._set("fence", iHeight);
        _setFenceHeight(this.id, iHeight * that._iModifier);
    }

    _set(sProperty, iValue) {
        document.getElementById("stats-"+this.number).getElementsByClassName(sProperty)[0].innerText = iValue;
        document.getElementById("info-"+this.number).getElementsByClassName(sProperty)[0].innerText = iValue;
    }
}