const that = this;
const socket = io();
socket.emit("hostConnect", {});

//TODO
// bird sounds
socket.on('init', ip => {
    document.getElementById("qrCode").getElementsByTagName("img")[0].src =
        "http://chart.apis.google.com/chart?chs=500x500&cht=qr&chld=L&chl=http://" + ip + "/control";
    document.getElementById("ip").innerText = "http://" + ip + "/control";
});

socket.on('clientUpdate', oInfo => {
    if (!that._iModifier) {
        setTimeout(() => handleClientUpdate(oInfo), 300);
    } else {
        handleClientUpdate(oInfo);
    }
});

function handleClientUpdate(oInfo) {
    const aPlayer = document.getElementsByClassName('player');
    const aButtons = document.getElementsByClassName('kick');
    const oDeck1 = document.getElementById("deck-1");
    const oDeck2 = document.getElementById("deck-2");
    const oStat1 = document.getElementById("stats-1");
    const oStat2 = document.getElementById("stats-2");
    const oInfo1 = document.getElementById("info-1");
    const oInfo2 = document.getElementById("info-2");

    const toggleButton = (oButton, bEnabled) => {
        if (bEnabled) {
            oButton.classList.remove("disabled");
        } else {
            oButton.classList.add("disabled");
        }
        oButton.disabled = !bEnabled;
    };

    const toggleElement = (oElement, bEnabled) => {
        if (bEnabled) {
            oElement.classList.add("fadeIn");
        } else {
            oElement.classList.remove("fadeIn");
        }
    };

    if (oInfo.player1) {
        window._oPlayer1 = new Player(oInfo.player1);
        aPlayer[0].innerHTML = "Spieler 1: Verbunden";
        toggleButton(aButtons[0], true);
        toggleElement(oDeck1, true);
        toggleElement(oStat1, true);
        toggleElement(oInfo1, true);
    } else {
        window._oPlayer1 = undefined;
        aPlayer[0].innerHTML = "Spieler 1: Nicht verbunden";
        toggleButton(aButtons[0], false);
        toggleElement(oDeck1, false);
        toggleElement(oStat1, false);
        toggleElement(oInfo1, false);
    }

    if (oInfo.player2) {
        window._oPlayer2 = new Player(oInfo.player2);
        aPlayer[1].innerHTML = "Spieler 2: Verbunden";
        toggleButton(aButtons[1], true);
        toggleElement(oDeck2, true);
        toggleElement(oStat2, true);
        toggleElement(oInfo2, true);
    } else {
        window._oPlayer2 = undefined;
        aPlayer[1].innerHTML = "Spieler 2: Nicht verbunden";
        toggleButton(aButtons[1], false);
        toggleElement(oDeck2, false);
        toggleElement(oStat2, false);
        toggleElement(oInfo2, false);
    }

    if (oInfo.message) {
        toast(oInfo.message);
    }
}

socket.on('playerUpdate', aPlayers => {
    _translateToFrontend(this._oPlayer1, aPlayers[0]);
    _translateToFrontend(this._oPlayer2, aPlayers[1]);
});

function _translateToFrontend(oFrontend, oBackend) {
    for (let property in oBackend) {
        if (oBackend.hasOwnProperty(property) && oFrontend[property] !== oBackend[property]) {
            oFrontend.set(property, oBackend[property]);
        }
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// ----- ||| PRIVATE ||| -----------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
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
            oDeadBird.y += i;
        } else {
            clearInterval(iIntervalY);
            _deleteDeadBird(id);
        }
    });

    const iIntervalI = setInterval(() => {
        if (oDeadBird.y < this._iFloor) {
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
        spawnCloud(Math.round(Math.random() * 2 + 2), -200);
    }, this._iCloudTimeout);
}

function _initializeBirds() {
    spawnBird();

    this.__birdSpawningInterval1 = setInterval(() => {
        spawnBird();
    }, 21000);

    this.__birdSpawningInterval2 = setInterval(() => {
        spawnBird();
        setTimeout(() => spawnBird(), Math.random() * 1000 + 400);
    }, 50000);
}

function _getCastle(id) {
    return window["_oPlayer" + id].castle;
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

function _initializeCanvas() {
    this._iWidth = window.innerWidth;
    this._iHeight = window.innerHeight;
    this._iModifier = Math.round(that._iHeight / 150);

    document.getElementById("canvas").width = this._iWidth;
    document.getElementById("canvas").height = this._iHeight;
}

function _onLoad() {
    _initializeCanvas();
    launch();
}

window.onload = () => _onLoad();

window.onresize = () => _initializeCanvas();

// ---------------------------------------------------------------------------------------------------------------------
// ----- ||| PUBLIC ||| ------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
/**
 * Launches the game
 * Initializes music, players, clouds and birds
 */
function launch() {
    this._music = new Sound("/sounds/music.mp3", 0.5, true);
    this._music.play();
    this._music.mute();
    this.__gameInterval = setInterval(() => _drawCanvas());
    _initializeClouds();
    _initializeBirds();
}

/**
 * Stops all intervals and stops the music
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
function spawnCloud(iSize = 4, x = Math.round(Math.random() * 900 - 200)) {
    if (!this._aActiveClouds) {
        this._aActiveClouds = [];
    }

    if (!this._iCloudCount) {
        this._iCloudCount = 0;
    }

    const oCloud = {
        id: "__cloud_" + this._iCloudCount++,
        x: x,
        y: Math.round(Math.random() * 200 + 50),
        size: iSize,
        color: this._sCloudColor || _getRandomColor()
    };

    let i = oCloud.x;
    let iSpeed = this._sCloudSpeed || Math.round(Math.random() * 50) + 50;

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
function animateCard(event, iPlayerId, iCardId) {
    if (this._placingCard) {
        return;
    }

    iPlayerId = parseInt(event.currentTarget.id.slice(5));
    this._placingCard = true;
    const oCard = document.getElementById("card-" + iPlayerId);

    let styleSheet;
    for (let i = 0; i < document.styleSheets.length; i++) {
        const e = document.styleSheets[i];
        if (e.href.indexOf("host.css") !== -1) {
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
        "background: url('" + sUrl + "');" +
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
        this._placingCard = false;
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
        y: y || Math.round(Math.random() * 200 + 50),
    };

    let i = oBird.x;

    const iInterval = setInterval(() => {
        if (i < this._iWidth + 100) {
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

    this._aActiveBirds.push(oBird);
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
 * Toggles the music
 */
function toggleMusic() {
    this._music.mute();
}


/**
 * Opens or closes the options dialog
 */
function toggleOptions() {
    const
        dialog = document.getElementById('options'),
        btnClose = document.getElementById('close');

    if (dialog.open) {
        dialog.close();
    } else {
        dialog.showModal();
        btnClose.focus();
        btnClose.addEventListener('click', toggleOptions);
        document.addEventListener('keydown', function (e) {
            if (e.key === "Escape") {
                dialog.close();
            }
        }, true);
    }
}

/**
 * Changes the volume of the game music
 * @param volume - Value from 0 to 1
 * @param event - Data of value change event of volume slider
 */
function changeVolume(volume, event) {
    if (event) {
        this._music.volume(event.srcElement.value / 100);
    }

    if (volume) {
        this._music.volume(volume);
    }
}

socket.on('toast', msg => toast(msg));

/**
 * Displays a notification message on the bottom of the screen
 * @param sText
 */
function toast(sText) {
    if (!this._aToasts) {
        this._aToasts = [];
    }
    this._aToasts.push(sText);

    if (!this._toasting) {
        _displayToast();
    }

    function _displayToast() {
        if (that._aToasts.length > 0) {
            that._toasting = true;
            const sText = that._aToasts[0];
            that._aToasts = that._aToasts.slice(1);
            const oToast = document.getElementById("toast");
            oToast.innerText = sText;
            oToast.classList.add("toastAnimation");
            setTimeout(() => {
                oToast.classList.remove("toastAnimation");
                setTimeout(() => _displayToast(), 100);
            }, 3000);
        } else {
            that._toasting = false;
        }
    }
}

/**
 * Kicks a player
 * @param number - Either '1' or '2'
 */
function kickPlayer(number) {
    socket.emit("clientKick", number);
}

function toggleQR() {
    const qr = document.getElementById("qrCode");
    if (qr.style.display === "block") {
        qr.style.display = "none";
    } else {
        qr.style.display = "block";
    }
}