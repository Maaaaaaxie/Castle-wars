class Player {
    constructor(oDef) {
        this.number = oDef.number;

        this.castle = oDef.castle;
        this._set("castle", oDef.castle);

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
            height: this.castle * that._iModifier,
            fence: {
                height: this.fence * that._iModifier
            }
        }
    }

    set(property, value) {
        switch (property) {
            case "color":
                this.setColor(value);
                break;
            case "castle":
                this.setCastle(value);
                break;
            case "fence":
                this.setFence(value);
                break;
            case "builders":
                this.setBuilders(value);
                break;
            case "stones":
                this.setStones(value);
                break;
            case "soldier":
                this.setSoldiers(value);
                break;
            case "weapons":
                this.setWeapons(value);
                break;
            case "mages":
                this.setMages(value);
                break;
            case "crystals":
                this.setCrystals(value);
                break;
            default:
                throw new Error("Invalid property")
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

    setCastle(i) {
        if (i < 0) {
            i = 0;
        } else if (i >= 100) {
            i = 100;
        }

        this.health = i;
        this._set("castle", i);
        _setCastleHeight(this.number, i * that._iModifier);
    }

    setFence(iHeight) {
        this.fence = iHeight;
        this._set("fence", iHeight);
        _setFenceHeight(this.number, iHeight * that._iModifier);
    }

    _set(sProperty, iValue) {
        document.getElementById("stats-" + this.number).getElementsByClassName(sProperty)[0].innerText = iValue;
        document.getElementById("info-" + this.number).getElementsByClassName(sProperty)[0].innerText = iValue;
    }
}