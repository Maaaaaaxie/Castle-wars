class Player {
    constructor(oDef) {
        this.initialized = false;
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

        this.castleDef = {
            color: oDef.color,
            height: this.castle * window._iModifier,
            fence: {
                height: this.fence * window._iModifier
            }
        };

        this.initialized = true;
    }

    set(property, value) {
        switch (property) {
            case "color":
                this.setColor(value);
                break;
            case "health":
                this.setHealth(value);
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
            case "soldiers":
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
        this._showDiff("builders", i);
        this.builders = i;
        this._set("builders", i);
    }

    setStones(i) {
        this._showDiff("stones", i);
        this.stones = i;
        this._set("stones", i);
    }

    setSoldiers(i) {
        this._showDiff("soldiers", i);
        this.soldiers = i;
        this._set("soldiers", i);
    }

    setWeapons(i) {
        this._showDiff("weapons", i);
        this.weapons = i;
        this._set("weapons", i);
    }

    setMages(i) {
        this._showDiff("mages", i);
        this.mages = i;
        this._set("mages", i);
    }

    setCrystals(i) {
        this._showDiff("crystals", i);
        this.crystals = i;
        this._set("crystals", i);
    }

    setHealth(i) {
        if (i < 0) {
            i = 0;
        } else if (i >= 100) {
            i = 100;
        }

        this._showDiff("castle", i);
        this.health = i;
        this._set("castle", i);
        _setCastleHeight(this.number, i * window._iModifier);
    }

    setFence(i) {
        this._showDiff("fence", i);
        this.fence = i;
        this._set("fence", i);
        _setFenceHeight(this.number, i * window._iModifier);
    }

    _set(sProperty, iValue) {
        document.getElementById("stats-" + this.number).getElementsByClassName(sProperty)[this.number-1].innerText = iValue;
        document.getElementById("info-" + this.number).getElementsByClassName(sProperty)[0].innerText = iValue;
    }

    _showDiff(property, i) {
        const diff = i - this[property];
        if (diff !== 0 && this.initialized) {
            const aDivs = document.getElementById("stats-"+this.number).getElementsByClassName("change");
            let oElement ;
            for (let i = 0; i < aDivs.length; i++) {
                const e = aDivs[i].getElementsByClassName(property)[0];
                if (e) {
                    oElement = e;
                    break;
                }
            }
            oElement.innerText = diff > 0 ? "+" + diff : diff;
            setTimeout(() => oElement.innerText = "", 3000);
        }
    }
}