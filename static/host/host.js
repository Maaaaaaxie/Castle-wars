const socket = io();

let aCards;
const _xhr = new XMLHttpRequest();
_xhr.open("GET", "/cards");
_xhr.onload = () => {
    if (_xhr.status === 200) {
        aCards = JSON.parse(_xhr.responseText);
    }
};
_xhr.send();

const oStates = {
    READY: "ready",
    RUNNING: "running",
    BLOCKED: "blocked",
    PAUSED: "paused"
};

function _onLoad() {
    window.menu.open();
    _initEventListeners();
    _initCanvas();
    _initGame();
}

window.menu = new Menu();
window.onload = () => _onLoad();
window.onresize = () => _initCanvas();

// ---------------------------------------------------------------------------------------------------------------------
// ----- ||| EVENT LISTENERS ||| ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

function _initEventListeners() {
    document.getElementById("launchButton").addEventListener("click", toggleGame.bind(null, true));
    document.getElementById("canvas").addEventListener("click", onCanvasClick);

    document.getElementById("options").getElementsByClassName("game")[0].getElementsByTagName("button")[0].addEventListener("click", toggleGame.bind(null, false));
    document.getElementById("options").getElementsByClassName("game")[0].getElementsByTagName("button")[1].addEventListener("click", pause);

    document.getElementById("volume").addEventListener("input", event => {
        changeVolume(null, event);
    });

    document.getElementsByName("showQrCode")[0].addEventListener("click", toggleQR);
    document.getElementById("qrCode").getElementsByTagName("button")[0].addEventListener("click", toggleQR);
    document.getElementById("qrCode").getElementsByTagName("img")[0].addEventListener("click", toggleQR);

    document.getElementById("toggleSound").addEventListener("click", toggleSound);
    document.getElementById("toggleMusic").addEventListener("click", toggleMusic);
    document.getElementById("toggleOptions").addEventListener("click", toggleOptions);
    document.getElementById("toggleFullscreen").addEventListener("click", toggleFullscreen);

    document.getElementById("impressum").addEventListener("click", () => window.open(location.href + "impressum", '_blank'))
    document.getElementById("datenschutz").addEventListener("click", () => window.open(location.href + "datenschutz", '_blank'))
}


// ---------------------------------------------------------------------------------------------------------------------
// ----- ||| SOCKETS ||| -----------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------

setTimeout(() => socket.emit("connected", "host"), 200);

socket.on('info', o => {
    document.getElementById("ip").innerText = o.link;

    window.started = o.game.state === oStates.RUNNING || o.game.state === oStates.PAUSED;
    const handleClientUpdate = function (oInfo) {
        const aPlayer = document.getElementsByClassName('player');
        const oQuitButton = document.getElementsByClassName("game")[0].getElementsByTagName("button")[0];
        const oPauseButton = document.getElementsByClassName("game")[0].getElementsByTagName("button")[1];

        const oCenter = document.getElementById("menu").getElementsByClassName("center")[0];
        const oCenterLaunch = oCenter.getElementsByClassName("content")[0].getElementsByClassName("launch")[0];
        const oCenterShow = oCenter.getElementsByClassName("content")[0].getElementsByClassName("show")[0];
        const oCenterInfo = oCenter.getElementsByClassName("info")[0];

        const oPlayer1 = oInfo.players.find(e => e.number === 1);
        const oPlayer2 = oInfo.players.find(e => e.number === 2);

        const toggleButton = (oButton, bEnabled) => {
            if (bEnabled) {
                oButton.classList.remove("disabled");
            } else {
                oButton.classList.add("disabled");
            }
            oButton.disabled = !bEnabled;
        };

        window.menu.togglePlayer(1, oPlayer1 && oPlayer1.connected);
        window.menu.togglePlayer(2, oPlayer2 && oPlayer2.connected);

        window._oPlayer1 = oPlayer1 && oPlayer1.connected ? new Player(oPlayer1) : undefined;
        window._oPlayer2 = oPlayer2 && oPlayer2.connected ? new Player(oPlayer2) : undefined;

        document.getElementById("pause").classList.remove("paused");
        if (o.game.state === oStates.READY) {
            window.menu.open();
            if (window._sState !== o.game.state) {
                setTimeout(() => toggleReady(true), 300);
            }
        } else if (o.game.state === oStates.BLOCKED) {
            window.menu.open();
            if (window._sState && window._sState !== o.game.state) {
                toggleReady(false);
            }
        } else if (o.game.state === oStates.RUNNING) {
            handleRunning();
        } else if (o.game.state === oStates.PAUSED) {
            handlePaused();
        }

        window._sState = o.game.state;

        function toggleReady(b) {
            const oElement1 = b ? oCenterLaunch : oCenterShow;
            const oElement2 = !b ? oCenterLaunch : oCenterShow;
            oCenterInfo.style.display = b ? "none" : "block";

            oElement2.classList.remove("animation-grow");
            oElement2.classList.add("animation-shrink");
            setTimeout(() => {
                oElement2.style.display = "none";
                oElement2.classList.remove("animation-shrink");
                oElement1.style.display = "grid";
                oElement1.classList.add("animation-grow");
            });
        }

        function handlePaused() {
            window.menu.open();
            toggleReady(o.players.filter(e => e.connected).length === 2);
            if (oInfo.players.length < 2) {
                toggleButton(oPauseButton, false);
            }
            document.getElementById("pause").classList.add("paused");
            oPauseButton.innerText = "Fortsetzen";
            toggleButton(oQuitButton, true);
            _showStats();
        }

        function handleRunning() {
            window.menu.close();
            toggleButton(oQuitButton, true);
            toggleButton(oPauseButton, true);
            _showStats();
            oPauseButton.innerText = "Pause";
        }
    };

    if (!window._iModifier) {
        setTimeout(() => handleClientUpdate(o), 600);
    } else {
        handleClientUpdate(o);
    }

});


socket.on('playerUpdate', aPlayers => {
    const aIgnoredProperties = [
        "id",
        "cards",
        "castleDef",
        "connected"
    ];

    const fnTranslateToFrontend = function (oFrontend, oBackend) {
        for (let property in oBackend) {
            if (aIgnoredProperties.indexOf(property) === -1) {
                if (oBackend.hasOwnProperty(property) && oFrontend[property] !== oBackend[property]) {
                    oFrontend.set(property, oBackend[property]);
                }
            }
        }
    };

    fnTranslateToFrontend(window._oPlayer1, aPlayers.find(e => e.number === 1));
    fnTranslateToFrontend(window._oPlayer2, aPlayers.find(e => e.number === 2));
});

socket.on('start', _showStats);

function _togglePlayerStats(iNumber, b) {
    const oDeck = document.getElementById("deck-" + iNumber);
    const oStat = document.getElementById("stats-" + iNumber);
    const oInfo = document.getElementById("info-" + iNumber);

    const toggleElement = (oElement, bEnabled) => {
        if (bEnabled) {
            oElement.classList.add("fadeIn");
        } else {
            oElement.classList.remove("fadeIn");
        }
    };

    toggleElement(oDeck, b);
    toggleElement(oStat, b);
    toggleElement(oInfo, b);
}

function _showStats() {
    const oGameToggleButton = document.getElementsByClassName("game")[0].getElementsByTagName("button")[0];
    oGameToggleButton.innerText = "Beenden";
    const oPauseButton = document.getElementsByClassName("game")[0].getElementsByTagName("button")[1];
    oPauseButton.disabled = false;
    oPauseButton.classList.remove("disabled");

    _togglePlayerStats(1, true);
    _togglePlayerStats(2, true);
}

socket.on('pause', o => {
    const oPauseButton = document.getElementsByClassName("game")[0].getElementsByTagName("button")[1];
    if (o.paused) {
        oPauseButton.innerText = "Fortsetzen";
        toast("Spiel pausiert");
        document.getElementById("pause").classList.add("paused");
    } else {
        window.menu.close();
        oPauseButton.innerText = "Pause";
        toast("Spiel wird fortgesetzt");
        document.getElementById("pause").classList.remove("paused");
    }
});

socket.on('quit', () => {
    _togglePlayerStats(1, false);
    _togglePlayerStats(2, false);
});

socket.on('finish', o => {
    toast(o.message);
});

socket.on('cardAnimation', o => {
    const card = aCards.find(e => e.id === o.id);
    animateCard(o.number, card.image, o.discard);
});

socket.on('toast', msg => toast(msg));

// ---------------------------------------------------------------------------------------------------------------------
// ----- ||| PRIVATE ||| -----------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
function _deleteBird(id) {
    window._aActiveBirds.forEach((e, i) => {
        if (e.id === id) {
            window._aActiveBirds.splice(i, 1);
        }
    })
}

function _deleteDeadBird(id) {
    window._aDeadBirds.forEach((e, i) => {
        if (e.id === id) {
            window._aDeadBirds.splice(i, 1);
        }
    })
}

function _getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function _spawnDeadBird(id) {
    const oBird = window._aActiveBirds.filter(e => e.id === id)[0];

    const oDeadBird = {
        id: oBird.id,
        x: oBird.x,
        y: oBird.y
    };

    if (!window._aDeadBirds) {
        window._aDeadBirds = [];
    }

    window._aDeadBirds.push(oDeadBird);

    let i = 1;
    const iIntervalY = setInterval(() => {
        if (oDeadBird.y < window._iFloor) {
            oDeadBird.y += i;
        } else {
            clearInterval(iIntervalY);
            _deleteDeadBird(id);
        }
    });

    const iIntervalI = setInterval(() => {
        if (oDeadBird.y < window._iFloor) {
            i++;
        } else {
            clearInterval(iIntervalI);
        }
    }, 100);

    const iIntervalX = setInterval(() => {
        if (oDeadBird.y < window._iFloor) {
            oDeadBird.x++;
        } else {
            clearInterval(iIntervalX);
        }
    }, 5);
}

function _initShip() {
    const x = Math.round(window.innerWidth / 1.7);
    const y = Math.round(window.innerHeight / 1.67);
    const diff = x - Math.round(window.innerWidth / 2.2);
    window._oShip = {x, y};

    function moveShip(i) {
        if (window._oShip.x + i > x + diff) {
            i = x + diff - window._oShip.x;
        } else if (window._oShip.x + i < x - diff) {
            i = x - diff - window._oShip.x;
        }

        const iInterval = setInterval(() => {
            if (i < 0) {
                window._oShip.x--;
                i++;
            } else if (i > 0) {
                window._oShip.x++;
                i--;
            } else {
                clearInterval(iInterval);
            }
        }, 80);
    }

    if (!window._oShip.interval) {
        window._oShip.interval = setInterval(() => {
            moveShip(Math.random() > 0.7 ? 14 : Math.random() < 0.3 ? -14 : 0);
        }, 700);
    }
}

function _initializeClouds() {
    window._iCloudTimeout = 15000;
    window._sCloudColor = "rgba(255, 255, 255, 0.90)";
    window._sCloudSpeed = undefined;

    spawnCloud(3);
    spawnCloud(4);
    spawnCloud(3, -100);

    window.__cloudSpawningInterval = setInterval(() => {
        spawnCloud(Math.round(Math.random() * 2 + 2), -200);
    }, window._iCloudTimeout);
}

function _initializeBirds() {
    spawnBird();

    window.__birdSpawningInterval1 = setInterval(() => {
        spawnBird();
    }, 21000);

    window.__birdSpawningInterval2 = setInterval(() => {
        spawnBird();
        setTimeout(() => spawnBird(), Math.random() * 1000 + 400);
    }, 50000);
}

function _getCastle(id) {
    return window["_oPlayer" + id].castleDef;
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

function _initCanvas() {
    window._iModifier = Math.round(window.innerHeight / 150);

    document.getElementById("canvas").width = window.innerWidth;
    document.getElementById("canvas").height = window.innerHeight;

    _initShip();
}

// ---------------------------------------------------------------------------------------------------------------------
// ----- ||| PUBLIC ||| ------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
/**
 * Initializes the game
 * Initializes music, gameInterval, clouds and birds
 */
function _initGame() {
    window.__gameInterval = setInterval(() => Canvas._drawCanvas(this));
    _initializeClouds();
    _initializeBirds();
}

function toggleGame(b) {
    const oMenu = document.getElementById("menu");
    const oQuitButton = document.getElementsByClassName("game")[0].getElementsByTagName("button")[0];
    const oPauseButton = document.getElementsByClassName("game")[0].getElementsByTagName("button")[1];
    if (b) {
        oQuitButton.classList.remove("disabled");
        oQuitButton.disabled = false;
        oMenu.classList.add("animation-shrink");
        setTimeout(() => {
            oMenu.classList.remove("animation-shrink");
            oMenu.style.display = "none";
        }, 1000);
        socket.emit('start');
    } else {
        oQuitButton.classList.add("disabled");
        oQuitButton.disabled = true;
        oPauseButton.classList.add("disabled");
        oPauseButton.disabled = true;
        oPauseButton.innerText = "Pause";

        document.getElementById("pause").classList.remove("paused");
        oMenu.classList.add("animation-grow");
        oMenu.style.display = "block";
        setTimeout(() => oMenu.classList.remove("animation-grow"), 1000);
        socket.emit('quit');
    }
}

function pause() {
    socket.emit('pause');
}

/**
 * Stops all intervals and stops the music
 */
function quit() {
    window._music.stop();
    clearInterval(window.__gameInterval);
    clearInterval(window.__cloudSpawningInterval);
    clearInterval(window.__birdSpawningInterval1);
    clearInterval(window.__birdSpawningInterval2);
}

/**
 * Spawns cloud which moves automatically
 * @param [iSize] - size of cloud (e.g. 2,3,4,...)
 * @param [x] - x position of cloud (e.g. 0, 200, 400)
 */
function spawnCloud(iSize = 4, x = Math.round(Math.random() * 900 - 200)) {
    if (!window._aActiveClouds) {
        window._aActiveClouds = [];
    }

    if (!window._iCloudCount) {
        window._iCloudCount = 0;
    }

    const oCloud = {
        id: "__cloud_" + window._iCloudCount++,
        x: x,
        y: Math.round(Math.random() * 200 + 50),
        size: iSize,
        color: window._sCloudColor || _getRandomColor()
    };

    let i = oCloud.x;
    let iSpeed = window._sCloudSpeed || Math.round(Math.random() * 50) + 50;

    const iInterval = setInterval(() => {
        if (i < window.innerWidth + 100) {
            oCloud.x = i;
            i++;
        } else {
            window._aActiveClouds.splice(0, 1);
            clearInterval(iInterval);
        }
    }, iSpeed);

    window._aActiveClouds.push(oCloud);
}

/**
 * Animates the card deck
 * @param iNumber
 */
function animateCard(iNumber, sPath, bDiscard) {
    if (window._placingCard) {
        return;
    }

    window._placingCard = true;
    const oCard = document.getElementById("card-" + iNumber);

    let styleSheet;
    for (let i = 0; i < document.styleSheets.length; i++) {
        const e = document.styleSheets[i];
        if (e.href.indexOf("host.css") !== -1) {
            styleSheet = e;
            break;
        }
    }
    const iIndex = styleSheet.cssRules.length;
    const sUrl = "../images/card/" + sPath;
    const sSide = iNumber === 1 ? "left" : "right";
    const sSidePercentage = iNumber === 1 ? "50%" : "-50%";

    const sRule1 =
        "@keyframes cardAnimation {" +
        "to {" +
        sSide + ": 50%;" +
        "background: #f4bc7d url(" + sUrl + ") center/contain no-repeat;" +
        "bottom: 70%;" +
        "width: 12rem;" +
        "height: 14rem;" +
        "transform: rotateY(180deg) translate(" + sSidePercentage + ", 50%);" +
        "}" +
        "}";

    const sRule2 =
        ".cardAnimation {" +
        "animation-name: cardAnimation;" +
        "animation-duration: 1s;" +
        "animation-fill-mode: forwards" +
        "}";

    styleSheet.insertRule(sRule1, iIndex);
    styleSheet.insertRule(sRule2, iIndex + 1);

    oCard.classList.add("cardAnimation");
    setTimeout(() => {
        oCard.classList.remove("cardAnimation");
        styleSheet.deleteRule(iIndex);
        styleSheet.deleteRule(iIndex);
        window._placingCard = false;
    }, 3000);
}

/**
 * [TEST FUNCTION]
 * Spawns a bird on the cursor position
 * @param event - Event information of browser event 'onclick'
 */
function onCanvasClick(event) {
    // animateCard(Math.round(Math.random()+1));
    spawnBird(event.x, event.y);
}

/**
 * Spawns bird which moves automatically
 * @param x - coordinate
 * @param y - coordinate
 */
function spawnBird(x, y) {
    if (y >= window._iFloor) {
        return;
    }

    if (!window._aActiveBirds) {
        window._aActiveBirds = [];
    }

    if (!window._iBirdCount) {
        window._iBirdCount = 0;
    }

    const oBird = {
        id: "__bird_" + window._iBirdCount++,
        x: x || -20,
        y: y || Math.round(Math.random() * 200 + 50),
    };

    let i = oBird.x;

    const iInterval = setInterval(() => {
        if (i < window.innerWidth + 100) {
            oBird.x = i;
            i++;

            // random behavior of bird
            if (Math.random() > 0.95) {
                oBird.y++;
            } else if (Math.random() < 0.05) {
                oBird.y--;
            }
        } else {
            _deleteBird(oBird.id);
            clearInterval(iInterval);
        }
    }, 10);

    window._aActiveBirds.push(oBird);
}

/**
 * Enables or disables the fullscreen mode
 */
function toggleFullscreen() {
    const element = document.documentElement;
    if (element.requestFullscreen) {
        if (document.isFullScreen) {
            document.exitFullscreen();
        } else {
            element.requestFullscreen();
        }
    } else if (element.mozRequestFullScreen) {
        if (document.mozIsFullScreen) {
            document.mozExitFullscreen();
        } else {
            element.mozRequestFullscreen();
        }
    } else if (element.msRequestFullscreen) {
        if (document.msIsFullScreen) {
            document.msExitFullscreen();
        } else {
            element.msRequestFullscreen();
        }
    } else if (element.webkitRequestFullscreen) {
        if (document.webkitIsFullScreen) {
            document.webkitExitFullscreen();
        } else {
            element.webkitRequestFullscreen();
        }
    }
}

/**
 * Toggles the sound
 */
window.sound = true;

function toggleSound() {
    const oToolbar = document.getElementById("toolbar");
    const oActive = oToolbar.getElementsByClassName("sound")[0].getElementsByTagName("img")[0];
    const oInactive = oToolbar.getElementsByClassName("sound")[0].getElementsByTagName("img")[1];

    window.sound = !window.sound;

    oActive.style.display = window.sound ? "block" : "none";
    oInactive.style.display = !window.sound ? "block" : "none";
}

/**
 * Toggles the music
 */
function toggleMusic() {
    const oToolbar = document.getElementById("toolbar");
    const oPlay = oToolbar.getElementsByClassName("music")[0].getElementsByTagName("img")[0];
    const oMute = oToolbar.getElementsByClassName("music")[0].getElementsByTagName("img")[1];
    const music = document.getElementById("music");

    if (!window.bMusicPlaying) {
        window.bMusicPlaying = true;
        music.play();
    } else {
        music.muted = !music.muted;
    }

    oPlay.style.display = !music.muted ? "block" : "none";
    oMute.style.display = music.muted ? "block" : "none";
}

/**
 * Opens or closes the options dialog
 */
function toggleOptions() {
    const
        btnClose = document.getElementById("close"),
        dialog = document.getElementById('options');

    dialog.style.display = dialog.style.display === "block" ? "none" : "block";

    btnClose.focus();

    if (!window._bOptionEventListenerSet) {
        window._bOptionEventListenerSet = true;

        const fnClose = () => dialog.style.display = "none";

        btnClose.addEventListener('click', fnClose);
        document.addEventListener('mousedown', e => {
            if (e.target.closest("#options") === null && e.target.closest("#toggleOptions") === null) {
                fnClose();
            }
        })
    }
}

/**
 * Changes the volume of the game music
 * @param volume - Value from 0 to 1
 * @param event - Data of value change event of volume slider
 */
function changeVolume(volume, event) {
    volume = volume || event.srcElement.value / 100;

    if (volume) {
        window._music.volume(volume);
    }

    if (volume === 1) {
        setTimeout(() => {
            if (window._music.sound.volume < 0.1) {
                wiiiiigle(document.getElementsByTagName("div"));
                wiiiiigle(document.getElementsByTagName("button"));
                wiiiiigle(document.getElementsByTagName("dialog"));
            }
        }, 500);
    }
}

/**
 * Displays a notification message on the bottom of the screen
 * @param sText
 */
function toast(sText) {
    if (!window._aToasts) {
        window._aToasts = [];
    }
    window._aToasts.push(sText);

    if (!window._toasting) {
        _displayToast();
    }

    function _displayToast() {
        if (window._aToasts.length > 0) {
            window._toasting = true;
            const sText = window._aToasts[0];
            window._aToasts = window._aToasts.slice(1);
            const oToast = document.getElementById("toast");
            oToast.innerText = sText;
            oToast.classList.add("toastAnimation");
            setTimeout(() => {
                oToast.classList.remove("toastAnimation");
                setTimeout(() => _displayToast(), 100);
            }, 3000);
        } else {
            window._toasting = false;
        }
    }
}

function toggleQR() {
    const qr = document.getElementById("qrCode");
    if (qr.style.display === "block") {
        qr.style.display = "none";
    } else {
        qr.style.display = "block";
    }
}


// ------- easter egg -------------------------------
function wiiiiigle(a, i = 0) {
    if (a[i]) {
        a[i].classList.add("wiggle");
        i++;
        setTimeout(() => wiiiiigle(a, i), 5);
    }
}
