// ---------------------------------------------------------------------------------------------------------------------
// ----- ||| PRIVATE ||| -----------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

function getCtx() {
    const c = document.getElementById("canvas");
    return c.getContext("2d");
}

function _createSky() {
    const ctx = getCtx();

    // sky
    ctx.fillStyle = "#85d6d7";
    ctx.fillRect(0,0,800,500);
}

function _createGrass() {
    const ctx = getCtx();

    // grass
    ctx.fillStyle = "#4ed749";
    ctx.fillRect(0,500,800,100);

    ctx.fillStyle = "#40af3b";
    ctx.fillRect(0,500,800,2);
}

function _createCastle(x, height) {
    const ctx = getCtx();

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

function _createCloud(x, y, size, color = "#FFF") {
    const ctx = getCtx();

    ctx.beginPath();
    ctx.moveTo(x, y);

    ctx.bezierCurveTo(x-(10*size),y,x-(10*size),y-(10*size),x,y-(8*size));
    ctx.bezierCurveTo(x+(2*size),y-(15*size),x+(8*size),y-(14*size),x+(10*size),y-(8*size));
    ctx.bezierCurveTo(x+(20*size),y-(10*size),x+(20*size),y,x+(10*size),y);
    ctx.bezierCurveTo(x,y,x,y,x,y);

    ctx.fillStyle = color;
    ctx.fill();
}

function _getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function _createActiveClouds() {
    window._activeClouds.forEach(oCloud => {
        _createCloud(oCloud.x, oCloud.y, oCloud.size, oCloud.color);
    });
}

function _initializeClouds() {
    this._iCloudTimeout = 10000;
    this._sCloudColor = "#FFF";

    spawnCloud(3);
    spawnCloud(4);

    window.__cloudSpawningInterval = setInterval(() => {
        spawnCloud(Math.round(Math.random()+3), -200);
    }, this._iCloudTimeout);
}

function _drawCanvas() {
    _createSky();
    _createCastle(90, sessionStorage.iCurrentHealth);
    _createCastle(710, sessionStorage.iCurrentHealth);
    _createGrass();
    _createActiveClouds();
}

function _onLoad() {
    sessionStorage.iCurrentHealth = 30;
    start();
}

// ---------------------------------------------------------------------------------------------------------------------
// ----- ||| PUBLIC ||| ------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

window.onload = () => _onLoad();

function start() {
    window.__gameInterval = setInterval(() => _drawCanvas());
    _initializeClouds();
}

function quit() {
    clearInterval(window.__gameInterval);
    clearInterval(window.__cloudSpawningInterval);
}

function spawnCloud(size = 4, x = Math.round(Math.random()*900-200)) {
    if (!window._activeClouds) {
        window._activeClouds = [];
    }

    const oCloud = {
        id: "__cloud_" + window._activeClouds.length,
        x: x,
        y: Math.round(Math.random()*200+50),
        size: size,
        color: this._sCloudColor || _getRandomColor()
    };

    let i = oCloud.x;
    let speed = Math.round(Math.random()*50)+50;

    const iCloudInterval = setInterval(() => {
        if (i < 850) {
            oCloud.x = i;
            i++;
        } else {
            clearInterval(iCloudInterval);
        }
    }, speed);

    window._activeClouds.push(oCloud);
}

function setCastleHealth(iHealth) {
    const iDiff = iHealth - sessionStorage.iCurrentHealth;

    const iTimeout = Math.abs(1 / iDiff * 1000);

    let i = 0;
    const iInterval = setInterval(() => {
        if (i < Math.abs(iDiff)) {
            iDiff > 0 ? sessionStorage.iCurrentHealth++ : sessionStorage.iCurrentHealth--;
            // _drawCanvas();
            i++;
        } else {
            clearInterval(iInterval);
        }
    }, iTimeout);
}