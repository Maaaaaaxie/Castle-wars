const that = this;
const socket = io();

socket.on('test', () => {
    const isItOrIsItNot = () => Math.random() > 0.5;
    const oPlayer = isItOrIsItNot() ? _oPlayer1 : _oPlayer2;
    const iHealth = isItOrIsItNot() ? oPlayer.health + 100 : oPlayer.health - 100;
    oPlayer.setHealth(iHealth);
});

// ---------------------------------------------------------------------------------------------------------------------
// ----- ||| CLASSES ||| -----------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

class Player {
    constructor(id, x, sColor) {
        this.id = id;

        const oInit = that._oInitialValues;
        this.health = oInit.health;

        this.stones = oInit.stones;
        this.builder = oInit.builder;

        this.weapons = oInit.weapons;
        this.soldiers = oInit.soldiers;

        this.crystals = oInit.crystals;
        this.mages = oInit.mages;

        this.castle = {
            x: x,
            color: sColor,
            height: this.health
        }
    }

    setColor(sColor) {
        this.castle.color = sColor;
    }

    setHealth(iHealth) {
        if (iHealth < 0) {
            iHealth = 0;
        } else if (iHealth > 400) {
            iHealth = 400;
        }

        this.health = iHealth;
        _setCastleHeight(this.id, iHealth);
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// ----- ||| PRIVATE ||| -----------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

function _getCtx() {
    const c = document.getElementById("canvas");
    return c.getContext("2d");
}

function _drawSky() {
    const ctx = _getCtx();
    ctx.fillStyle = "#85d6d7";
    ctx.fillRect(0,0,this._iWidth,this._iHeight);
}

function _drawGrass() {
    const ctx = _getCtx();

    const iFloor = this._iHeight - Math.round(this._iHeight / 5);
    const iHeight = this._iHeight - iFloor;

    // grass
    ctx.fillStyle = "#4ed749";
    ctx.fillRect(0,iFloor,this._iWidth,iHeight);

    ctx.fillStyle = "#40af3b";
    ctx.fillRect(0,iFloor,this._iWidth,2);

    this._iFloor = iFloor;
}

function _drawCastle(x, y, oCastleDef) {
    const ctx = _getCtx();
    const iHeight = oCastleDef.height;
    const sColor = oCastleDef.color || "#b29759";

    const fnDarkenColor = function(sColor, iAmt) {
        const num = parseInt(sColor.replace("#",""),16);
        const r = (num >> 16) + iAmt;
        const b = ((num >> 8) & 0x00FF) + iAmt;
        const g = (num & 0x0000FF) + iAmt;
        const sNewColor = g | (b << 8) | (r << 16);
        return sNewColor.toString(16);
    };

    // base
    ctx.fillStyle = sColor;
    ctx.fillRect(x-50,y-iHeight,100,iHeight+45);
    ctx.fillRect(x-40,y-10-iHeight,16,10);
    ctx.fillRect(x-9,y-10-iHeight,16,10);
    ctx.fillRect(x+22,y-10-iHeight,16,10);

    // --- towers -----------
    ctx.fillStyle = "#" + fnDarkenColor(sColor, -35);

    // tower left
    ctx.fillRect(x-62,y-25-iHeight,24,iHeight+70);
    ctx.fillRect(x-66,y-32-iHeight,8,15);
    ctx.fillRect(x-54,y-32-iHeight,8,15);
    ctx.fillRect(x-42,y-32-iHeight,8,15);

    // tower right
    ctx.fillRect(x+38,y-25-iHeight,24,iHeight+70);
    ctx.fillRect(x+34,y-32-iHeight,8,15);
    ctx.fillRect(x+46,y-32-iHeight,8,15);
    ctx.fillRect(x+58,y-32-iHeight,8,15);

    oCastleDef.top = y-32-iHeight;
    oCastleDef.left = x-66;
}

function _drawCloud(x, y, size, color) {
    const ctx = _getCtx();

    ctx.beginPath();
    ctx.moveTo(x, y);

    ctx.bezierCurveTo(x-(10*size),y,x-(10*size),y-(10*size),x,y-(8*size));
    ctx.bezierCurveTo(x+(2*size),y-(15*size),x+(8*size),y-(14*size),x+(10*size),y-(8*size));
    ctx.bezierCurveTo(x+(20*size),y-(10*size),x+(20*size),y,x+(10*size),y);
    ctx.bezierCurveTo(x,y,x,y,x,y);

    ctx.fillStyle = color;
    ctx.fill();
}

function _deleteBird(id) {
    this._aActiveBirds.forEach((e, i) => {
        if (e.id === id) {
            this._aActiveBirds.splice(i, 1);
        }
    })
}

function _drawBird(x, y, id) {
    const
        top1 = _oPlayer1.castle.top,
        top2 = _oPlayer2.castle.top,
        left1 = _oPlayer1.castle.left,
        left2 = _oPlayer2.castle.left;

    if (y >= top1 && x >= left1-5 && x <= left1 + 132) {
        _deleteBird(id);
    }

    if (y >= top2 && x >= left2-5 && x <= left2 + 132) {
        _deleteBird(id);
    }

    const ctx = _getCtx();
    ctx.fillStyle = "#464954";

    // body
    ctx.fillRect(x,y,10,6);
    ctx.fillRect(x-4,y,4,4);
    ctx.fillRect(x-8,y,4,2);

    // head
    ctx.fillRect(x+6,y-4,6,4);
    ctx.fillStyle = "#FFF";
    ctx.fillRect(x+9,y-2,2,2);
    ctx.fillStyle = "#000";
    ctx.fillRect(x+10,y-1,1,1);
    ctx.fillStyle = "#cb8d1e";
    ctx.fillRect(x+10,y,4, 3);
}

function _getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function _drawActiveClouds() {
    this._aActiveClouds.forEach(oCloud => {
        _drawCloud(oCloud.x, oCloud.y, oCloud.size, oCloud.color);
    });
}

function _drawActiveBirds() {
    this._aActiveBirds.forEach(oBird => {
        _drawBird(oBird.x, oBird.y, oBird.id);
    });
}

function _initializeClouds() {
    this._iCloudTimeout = 15000;
    this._sCloudColor = "rgba(255, 255, 255, 0.90)";
    this._sCloudSpeed = undefined;

    spawnCloud(3);
    spawnCloud(4);
    spawnCloud(3, -100);

    this.__cloudSpawningInterval = setInterval(() => {
        spawnCloud(Math.round(Math.random()*2+2), -200);
    }, this._iCloudTimeout);
}

function _initializeBirds() {
    spawnBird();

    this.__birdSpawningInterval1 = setInterval(() => {
        spawnBird();
    }, 21000);

    this.__birdSpawningInterval2 = setInterval(() => {
        spawnBird();
        setTimeout(() => spawnBird(), Math.random()*1000+400);
    }, 50000);
}

function _initializePlayers() {
    const that = this;

    this._oInitialValues = {
        health: 0,
        stones: 8,
        builder: 2,
        weapons: 8,
        soldiers: 2,
        crystals: 8,
        mages: 2
    };

    window._oPlayer1 = new Player("1", 90, "#d3b961");
    window._oPlayer2 = new Player("2", 710, "#912b32");
}

function _getCastle(id) {
    return window["_oPlayer"+id].castle;
}

function _setCastleHeight(id, iHeight) {
    const oCastle = _getCastle(id);
    const iDiff = iHeight - oCastle.height;
    const iTimeout = Math.abs(1 / iDiff * 1000);

    let i = 0;
    const iInterval = setInterval(() => {
        if (i < Math.abs(iDiff)) {
            iDiff > 0 ? oCastle.height++ : oCastle.height--;
            i++;
        } else {
            clearInterval(iInterval);
        }
    }, iTimeout);
}

function _drawCanvas() {
    _drawSky();
    _drawCastle(Math.round(this._iWidth * 0.2), this._iFloor, window._oPlayer1.castle);
    _drawCastle(Math.round(this._iWidth * 0.8), this._iFloor, window._oPlayer2.castle);
    _drawGrass();
    _drawActiveClouds();
    _drawActiveBirds();
}

function initializeCanvas() {
    this._iWidth = window.innerWidth;
    this._iHeight = window.innerHeight;

    document.getElementById("canvas").width = this._iWidth;
    document.getElementById("canvas").height = this._iHeight;
}

function _onLoad() {
    initializeCanvas();
    start();
}

window.onload = () => _onLoad();

window.onresize = () => initializeCanvas();

// ---------------------------------------------------------------------------------------------------------------------
// ----- ||| PUBLIC ||| ------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Launch the game
 */
function start() {
    _initializePlayers();
    this.__gameInterval = setInterval(() => _drawCanvas());
    _initializeClouds();
    _initializeBirds();
}

/**
 * Quit the game
 */
function quit() {
    clearInterval(this.__gameInterval);
    clearInterval(this.__cloudSpawningInterval);
    clearInterval(this.__birdSpawningInterval1);
    clearInterval(this.__birdSpawningInterval2);
}

/**
 * Spawns cloud which moves automatically
 * @param [iSize] - size of cloud (e.g. 2,3,4,...)
 * @param [x] - x position of cloud (e.g. 0, 200, 400)
 */
function spawnCloud(iSize = 4, x = Math.round(Math.random()*900-200)) {
    if (!this._aActiveClouds) {
        this._aActiveClouds = [];
    }

    if (!this._iCloudCount) {
        this._iCloudCount = 0;
    }

    const oCloud = {
        id: "__cloud_" + this._iCloudCount++,
        x: x,
        y: Math.round(Math.random()*200+50),
        size: iSize,
        color: this._sCloudColor || _getRandomColor()
    };

    let i = oCloud.x;
    let iSpeed = this._sCloudSpeed || Math.round(Math.random()*50)+50;

    const iInterval = setInterval(() => {
        if (i < this._iWidth + 100) {
            oCloud.x = i;
            i++;
        } else {
            this._aActiveClouds.splice(0, 1);
            clearInterval(iInterval);
        }
    }, iSpeed);

    this._aActiveClouds.push(oCloud);
}

/**
 * Spawns bird which moves automatically
 */
function spawnBird() {
    if (!this._aActiveBirds) {
        this._aActiveBirds = [];
    }

    if (!this._iBirdCount) {
        this._iBirdCount = 0;
    }

    const oBird = {
        id: "__bird_" + this._iBirdCount++,
        x: -20,
        y: Math.round(Math.random()*200+50),
    };

    let i = oBird.x;

    const iInterval = setInterval(() => {
        if (i < this._iWidth + 100) {
            oBird.x = i;
            i++;

            // random behavior of bird
            if (Math.random() > 0.95) {
                oBird.y++;
            } else if(Math.random() < 0.05) {
                oBird.y--;
            }
        } else {
            _deleteBird(oBird.id);
            clearInterval(iInterval);
        }
    }, 10);

    this._aActiveBirds.push(oBird);
}