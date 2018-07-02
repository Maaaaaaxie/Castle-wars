function getCtx() {
    const c = document.getElementById("canvas");
    return c.getContext("2d");
}

function createSky() {
    const ctx = getCtx();

    // sky
    ctx.fillStyle = "#85d6d7";
    ctx.fillRect(0,0,800,500);
}

function createGrass() {
    const ctx = getCtx();

    // grass
    ctx.fillStyle = "#4ed749";
    ctx.fillRect(0,500,800,100);

    ctx.fillStyle = "#40af3b";
    ctx.fillRect(0,500,800,2);
}

function createCastle(x, height) {
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

function createCloud(x, y, size) {
    const ctx = getCtx();

    ctx.beginPath();
    ctx.moveTo(x, y);

    ctx.bezierCurveTo(x-(10*size),y,x-(10*size),y-(10*size),x,y-(8*size));
    ctx.bezierCurveTo(x+(2*size),y-(15*size),x+(8*size),y-(14*size),x+(10*size),y-(8*size));
    ctx.bezierCurveTo(x+(20*size),y-(10*size),x+(20*size),y,x+(10*size),y);
    ctx.bezierCurveTo(x,y,x,y,x,y);

    ctx.fillStyle = "#FFF";
    ctx.fill();
}

function animateCloud(id) {
    let i = 0;
    const iCloudInterval = setInterval(() => {
        if (i < 850) {
            window._activeClouds.filter(cloud => cloud.id === id)[0].x = i;
            i++;
        } else {
            clearInterval(iCloudInterval);
        }
    }, 100);
}

function createActiveClouds() {
    window._activeClouds.forEach(cloud => {
        createCloud(cloud.x, cloud.y, cloud.size);
    });
}

function drawCanvas() {
    createSky();
    createCastle(90, sessionStorage.iCurrentHealth);
    createCastle(710, sessionStorage.iCurrentHealth);
    createGrass();
    createActiveClouds();
}

function onLoad() {
    sessionStorage.iCurrentHealth = 30;
    startGame();
}

window.onload = () => onLoad();

function startGame() {
    window.__game = setInterval(() => drawCanvas());

    window._activeClouds = [
        {
            id: "__cloud_1",
            x: 0,
            y: 100
        }
    ];

    animateCloud("__cloud_1");
}

function quitGame() {
    clearInterval(window.__game);
}

function setCastleHealth(iHealth) {
    const iDiff = iHealth - sessionStorage.iCurrentHealth;

    const iTimeout = Math.abs(1 / iDiff * 1000);

    let i = 0;
    const iInterval = setInterval(() => {
        if (i < Math.abs(iDiff)) {
            iDiff > 0 ? sessionStorage.iCurrentHealth++ : sessionStorage.iCurrentHealth--;
            // drawCanvas();
            i++;
        } else {
            clearInterval(iInterval);
        }
    }, iTimeout);
}