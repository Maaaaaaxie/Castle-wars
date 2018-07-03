const that = this;

// ---------------------------------------------------------------------------------------------------------------------
// ----- ||| CLASSES ||| -----------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

class Player {
    constructor(id, x, color) {
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
            color: color,
            height: this.health
        }
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
    ctx.fillRect(0,0,this._width,this._height);
}

function _drawGrass() {
    const ctx = _getCtx();

    const iFloor = this._height - Math.round(this._height / 5);
    const iHeight = this._height - iFloor;

    // grass
    ctx.fillStyle = "#4ed749";
    ctx.fillRect(0,iFloor,this._width,iHeight);

    ctx.fillStyle = "#40af3b";
    ctx.fillRect(0,iFloor,this._width,2);

    this._iFloor = iFloor;
}

function _drawCastle(x, y, height) {
    const ctx = _getCtx();

    // base
    ctx.fillStyle = "#d7945b";
    ctx.fillRect(x-50,505-height,100,height+45);
    ctx.fillRect(x-40,495-height,16,10);
    ctx.fillRect(x-9,495-height,16,10);
    ctx.fillRect(x+22,495-height,16,10);

    // --- towers -----------
    ctx.fillStyle = "#9f6d43";

    // tower left
    ctx.fillRect(x-62,480-height,24,height+70);
    ctx.fillRect(x-66,470-height,8,15);
    ctx.fillRect(x-54,470-height,8,15);
    ctx.fillRect(x-42,470-height,8,15);

    // tower right
    ctx.fillRect(x+38,480-height,24,height+70);
    ctx.fillRect(x+34,470-height,8,15);
    ctx.fillRect(x+46,470-height,8,15);
    ctx.fillRect(x+58,470-height,8,15);
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

function _drawBird(x, y) {
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
        _drawBird(oBird.x, oBird.y);
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
    this._iBirdTimeout = 30000;
    this._sBirdSpeed = 10;

    spawnBird();
}

function _initializePlayers() {
    const that = this;

    this._oInitialValues = {
        health: 50,
        stones: 8,
        builder: 2,
        weapons: 8,
        soldiers: 2,
        crystals: 8,
        mages: 2
    };

    window._oPlayer1 = new Player("1", 90);
    window._oPlayer2 = new Player("2", 710);
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
    _drawCastle(90, this._iFloor, window._oPlayer1.castle.height);
    _drawCastle(710, this._iFloor, window._oPlayer2.castle.height);
    _drawGrass();
    _drawActiveClouds();
    _drawActiveBirds();
}

function initializeCanvas() {
    this._width = 800; //window.innerWidth;
    this._height = 600; //window.innerHeight;

    document.getElementById("canvas").width = this._width;
    document.getElementById("canvas").height = this._height;
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

    const oCloud = {
        id: "__cloud_" + this._aActiveClouds.length,
        x: x,
        y: Math.round(Math.random()*200+50),
        size: iSize,
        color: this._sCloudColor || _getRandomColor()
    };

    let i = oCloud.x;
    let iSpeed = this._sCloudSpeed || Math.round(Math.random()*50)+50;

    const iInterval = setInterval(() => {
        if (i < this._width + 100) {
            oCloud.x = i;
            i++;
        } else {
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

    const oBird = {
        id: "__bird_" + this._aActiveBirds.length,
        x: -20,
        y: Math.round(Math.random()*200+50),
    };

    let i = oBird.x;

    const iInterval = setInterval(() => {
        if (i < this._width + 100) {
            oBird.x = i;
            i++;

            // random behavior of bird
            if (Math.random() > 0.99) {
                oBird.y++;
            } else if(Math.random() < 0.01) {
                oBird.y--;
            }

        } else {
            clearInterval(iInterval);
        }
    }, 10);

    this._aActiveBirds.push(oBird);
}