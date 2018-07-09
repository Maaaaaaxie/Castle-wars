const that = this;
const socket = io();

//TODO
// bird sounds

socket.on('test', () => {
    spawnBird(Math.round(Math.random()*100+100));
    spawnBird(Math.round(Math.random()*100+100));
    spawnBird(Math.round(Math.random()*100+100));
    spawnBird(Math.round(Math.random()*100+100));
    spawnBird(Math.round(Math.random()*100+100));
    spawnBird(Math.round(Math.random()*100+100));
    spawnBird(Math.round(Math.random()*100+100));
    spawnBird(Math.round(Math.random()*100+100));
    const isItOrIsItNot = () => Math.random() > 0.5;
    const oPlayer = isItOrIsItNot() ? _oPlayer1 : _oPlayer2;
    const iHealth = isItOrIsItNot() ? oPlayer.health + 100 : oPlayer.health - 100;
    oPlayer.setHealth(iHealth);
});

// ---------------------------------------------------------------------------------------------------------------------
// ----- ||| CLASSES ||| -----------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
class Sound {
    constructor(sSrc, fVolume = 0.5, bLoop = false) {
        this.sound = document.createElement("audio");
        this.sound.src = sSrc;
        this.sound.volume = fVolume;
        this.sound.loop = bLoop;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
            this.sound.play();
        };
        this.stop = function(){
            this.sound.pause();
        };
        this.mute = function() {
            this.sound.muted = !this.sound.muted;
        };
        this.volume = function(f) {
            this.sound.volume = f;
        };
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

    ctx.fillStyle = "#63472e";
    const sDoorHeight = iHeight < 70 ? iHeight-10 : 60;

    ctx.fillRect(x-20,y-sDoorHeight,40,sDoorHeight);

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

function _drawFence(x, y, oCastleDef) {
    const ctx = _getCtx();
    const iHeight = oCastleDef.fence.height;
    const sColor = oCastleDef.color || "#b29759";

    const fnDarkenColor = function(sColor, iAmt) {
        const num = parseInt(sColor.replace("#",""),16);
        const r = (num >> 16) + iAmt;
        const b = ((num >> 8) & 0x00FF) + iAmt;
        const g = (num & 0x0000FF) + iAmt;
        const sNewColor = g | (b << 8) | (r << 16);
        return sNewColor.toString(16);
    };

    ctx.fillStyle = sColor;
    ctx.fillRect(x-5,y-iHeight,10,iHeight+45);

    ctx.fillStyle = "#"+fnDarkenColor(sColor,-30);
    ctx.fillRect(x-5,y-iHeight, 10,10);

    oCastleDef.fence.top = y-iHeight;
    oCastleDef.fence.left = x-5;
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

function _deleteDeadBird(id) {
    this._aDeadBirds.forEach((e, i) => {
        if (e.id === id) {
            this._aDeadBirds.splice(i, 1);
        }
    })
}

function _drawDeadBird(x, y) {
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

function _drawBird(x, y, id) {
    const
        top1 = _oPlayer1.castle.top,
        top2 = _oPlayer2.castle.top,
        top3 = _oPlayer1.castle.fence.top,
        top4 = _oPlayer2.castle.fence.top,
        left1 = _oPlayer1.castle.left,
        left2 = _oPlayer2.castle.left,
        left3 = _oPlayer1.castle.fence.left,
        left4 = _oPlayer2.castle.fence.left;

    if (y >= top1 && x >= left1-5 && x <= left1 + 132) {
        _spawnDeadBird(id);
        _deleteBird(id);
    }

    if (y >= top2 && x >= left2-5 && x <= left2 + 132) {
        _spawnDeadBird(id);
        _deleteBird(id);
    }

    if (y >= top3 && x >= left3-8 && x <= left3 + 10) {
        _spawnDeadBird(id);
        _deleteBird(id);
    }

    if (y >= top4 && x >= left4-8 && x <= left4 + 10) {
        _spawnDeadBird(id);
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

function _drawDeadBirds() {
    if (this._aDeadBirds) {
        this._aDeadBirds.forEach(oBird => {
            _drawDeadBird(oBird.x, oBird.y);
        });
    }
}

function _spawnDeadBird(id) {
    const oBird = this._aActiveBirds.filter(e => e.id === id)[0];

    const oDeadBird = {
        id: oBird.id,
        x: oBird.x,
        y: oBird.y
    };

    if (!this._aDeadBirds) {
        this._aDeadBirds = [];
    }

    this._aDeadBirds.push(oDeadBird);

    let i = 1;
    const iIntervalY = setInterval(() => {
        if (oDeadBird.y < this._iFloor) {
            oDeadBird.y+=i;
        } else {
            clearInterval(iIntervalY);
            _deleteDeadBird(id);
        }
    });

    const iIntervalI = setInterval(() => {
        if(oDeadBird.y < this._iFloor) {
            i++;
        } else {
            clearInterval(iIntervalI);
        }
    }, 100);

    const iIntervalX = setInterval(() => {
        if (oDeadBird.y < this._iFloor) {
            oDeadBird.x++;
        } else {
            clearInterval(iIntervalX);
        }
    }, 5);
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
        health: 20,
        fence: 10,
        stones: 8,
        builders: 2,
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
    const iTimeout = Math.abs(1 / iDiff * 300);

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

function _setFenceHeight(id, iHeight) {
    const oCastle = _getCastle(id);
    const iDiff = iHeight - oCastle.fence.height;
    const iTimeout = Math.abs(1 / iDiff * 1000);

    let i = 0;
    const iInterval = setInterval(() => {
        if (i < Math.abs(iDiff)) {
            iDiff > 0 ? oCastle.fence.height++ : oCastle.fence.height--;
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
    _drawFence(Math.round(this._iWidth * 0.35), this._iFloor, window._oPlayer1.castle);
    _drawFence(Math.round(this._iWidth * 0.65), this._iFloor, window._oPlayer2.castle);
    _drawGrass();
    _drawActiveClouds();
    _drawActiveBirds();
    _drawDeadBirds();
}

function initializeCanvas() {
    this._iWidth = window.innerWidth;
    this._iHeight = window.innerHeight;
    this._iModifier = Math.round(that._iHeight / 150);

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
 * Launches the game
 */
function start() {
    this._music = new Sound("/sounds/music.mp3", 0.5, true);
    this._music.play();
    this._music.mute();
    _initializePlayers();
    this.__gameInterval = setInterval(() => _drawCanvas());
    _initializeClouds();
    _initializeBirds();
}

/**
 * Stops the game
 */
function quit() {
    this._music.stop();
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
 * Animates the card deck
 * @param iPlayerId
 */
function placeCard(event, iPlayerId, iCardId) {
    if (this._placingCard) {
        return;
    }

    iPlayerId = parseInt(event.currentTarget.id.slice(5));
    this._placingCard = true;
    const oCard = document.getElementById("card-"+iPlayerId);

    let styleSheet;
    for (let i = 0; i < document.styleSheets.length; i++) {
        const e = document.styleSheets[i];
        if (e.href.indexOf("game.css") !== -1) {
            styleSheet = e;
            break;
        }
    }
    const iIndex = styleSheet.cssRules.length;
    const sUrl = "https://classroomclipart.com/images/gallery/Clipart/Castles/TN_medieval-castle-with-flags-clipart.jpg";
    const sSide = iPlayerId === 1 ? "left" : "right";
    const sSidePercentage = iPlayerId === 1 ? "50%" : "-50%";

    const sRule1 =
        "@keyframes cardAnimation {" +
            "to {" +
                sSide + ": 50%;" +
                "bottom: 70%;" +
                "width: 12rem;" +
                "height: 14rem;" +
                "transform: rotateY(180deg) translate(" + sSidePercentage + ", 50%);" +
                "background-size: 100px 100px;" +
                "background: url('"+ sUrl +"');" +
            "}" +
        "}";

    const sRule2 =
        ".cardAnimation {" +
            "animation-name: cardAnimation;" +
            "animation-duration: 1s;" +
            "animation-fill-mode: forwards"+
        "}";

    styleSheet.insertRule(sRule1, iIndex);
    styleSheet.insertRule(sRule2, iIndex + 1);

    oCard.classList.add("cardAnimation");
    setTimeout(() => {
        oCard.classList.remove("cardAnimation");
        styleSheet.deleteRule(iIndex);
        styleSheet.deleteRule(iIndex);
        this._placingCard = false;
    }, 3000);
}

/**
 * Spawns a bird on the cursor position
 * @param event - Event information of browser event 'onclick'
 */
function onCanvasClick(event) {
    // placeCard(Math.round(Math.random()+1));
    spawnBird(event.x, event.y);
}

/**
 * Spawns bird which moves automatically
 * @param x - coordinate
 * @param y - coordinate
 */
function spawnBird(x, y) {
    if (y >= this._iFloor) {
        return;
    }

    if (!this._aActiveBirds) {
        this._aActiveBirds = [];
    }

    if (!this._iBirdCount) {
        this._iBirdCount = 0;
    }

    const oBird = {
        id: "__bird_" + this._iBirdCount++,
        x: x || -20,
        y: y || Math.round(Math.random()*200+50),
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

function toggleFullscreen() {
    const element = document.documentElement;
    if(element.requestFullscreen) {
        if (document.isFullScreen) {
            document.exitFullscreen();
        } else {
            element.requestFullscreen();
        }
    } else if(element.mozRequestFullScreen) {
        if (document.mozIsFullScreen) {
            document.mozExitFullscreen();
        } else {
            element.mozRequestFullscreen();
        }
    } else if(element.msRequestFullscreen) {
        if (document.msIsFullScreen) {
            document.msExitFullscreen();
        } else {
            element.msRequestFullscreen();
        }
    } else if(element.webkitRequestFullscreen) {
        if (document.webkitIsFullScreen) {
            document.webkitExitFullscreen();
        } else {
            element.webkitRequestFullscreen();
        }
    }
}

function toggleMusic() {
    this._music.mute();
}

function toggleOptions() {
    const
        dialog = document.getElementById('options'),
        btnClose = document.getElementById('close-options');

    if (dialog.open) {
        dialog.close();
    } else {
        dialog.showModal();
        btnClose.focus();
        btnClose.addEventListener('click', toggleOptions);
        document.addEventListener('keydown', function(e) {
            if (e.key === "Escape") {
                dialog.close();
            }
        }, true);
    }
}

function changeVolume(event) {
    this._music.volume(event.srcElement.value/100);
}