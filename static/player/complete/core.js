import Information from "/modules/Information.js";
import Resources from "/modules/Resources.js";
import Cards from "/modules/Cards.js";

document.getElementById("uname").focus();

const socket = window.socket = io();
window.player = {};
window._moveAllowed = false;
window._cards = [];
window._started = false;

const oStates = {
    READY: "ready",
    RUNNING: "running",
    PAUSED: "paused",
    BLOCKED: "blocked"
};

const btnJoin = document.getElementById("launchButton");
btnJoin.addEventListener("click", e => {
	window._settings.fullscreen && window.enterFullscreen(document.documentElement);
	socket.emit("join");
	btnJoin.disabled = true;
});

/**
 * socket.on
 * - init ({ id, game{ active, state }, players[] })
 * - start ()
 * - turn (iTime, iActive)
 * - done ()
 * - leave ()
 * - pause ()
 * - playerUpdate ([ player1, player2 ])
 */

socket.on("init", o => {
    window._id = o.id;

    // display join button
    if (o.state === oStates.BLOCKED) {
        btnJoin.style.display = "block";
    }
});

document.getElementById("uname").addEventListener("keypress", uname);

function uname(e) {
    if (e.keyCode === 13) {
        const sId = document.getElementById("uname").value;
        document.getElementById("uname").style.display = "none";
        socket.emit("connected", {sType: "client", sId: sId});
    }
}

socket.on("info", o => {
    window.player = o.players.find(e => e.id === window._id);

    if (window.player) {
        startGame(window.player);
    }
});

// fired when the game starts
socket.on("start", () => {
    console.log("The game has started");

    Cards.unfoldAll();
});

socket.on("turn", o => {
    if (o.active === window.player.number) {
        console.log("turn");
        Information.turn(o.duration);
        window._moveAllowed = true; // TODO: fix this, implement properly
    }
});

socket.on("done", () => {
    console.log("Move finished");

    Information.stop();
    window._moveAllowed = false;
});

socket.on("playerUpdate", a => {
    console.log("playerUpdate", a);

    const oPlayer = a.find(e => e.number === window.player.number);

    Resources.update(oPlayer);
    const
        aCurrentCards = Cards.getCurrentCards(),
        aNewCards = oPlayer.cards;

    if (aCurrentCards.length < 8) {
        aCurrentCards.forEach(e => aNewCards.splice(aNewCards.indexOf(e), 1));

        Cards.renderCard({sCardId: aNewCards[0], oPlayer});
    }

    aCurrentCards.forEach(e => Cards.updateStatus(e, oPlayer));
});

socket.on("pause", o => {
	if (o.paused) {
		Information.stop(false);
		Cards.foldAll();
	} else {
		Cards.unfoldAll();
		Information.start(o.remaining);
	}
});

// fired when the connection is lost
socket.on("leave", () => {
    console.log("Left the game");
    // debugger;
    // document.getElementById("infotext").getElementsByTagName("img")[0].src = "/images/basic/no-wifi.png";
    // document.getElementById("infotext").getElementsByTagName("span")[0].innerText = "";
    // document.getElementById("information").classList.remove("joined");
});

function startGame(oPlayer) {
    if (window._started) {
        return;
    }
    window._started = true;

    // hide loading canvas animation of the castle
    window.setTimeout(() => {
        // fade out the canvas
        document.getElementById("canvas").parentElement.classList.add("hidden");
        document.body.removeChild(document.getElementById("centerWrapper"));

        // after the fade out animation has finished, we...
        window.setTimeout(() => {
            // ... clear the drawing interval call...
            window.clearInterval(iInterval);
            // ... and remove the canvas element from the document
            document.body.removeChild(document.getElementById("canvas").parentElement);

            // then, all the necessecary parts/wrappers are rendered:
            document.body.appendChild(Information.render(window.player.number)); // the information part on the top
            document.body.appendChild(Resources.render()); // the resources in the middle
            document.body.appendChild(Cards.render()); // and the card area on the bottom

            // set the resources
            Resources.update(oPlayer);

            // render the deck
            oPlayer.cards.forEach(sCardId => Cards.renderCard({sCardId, oPlayer, bFlipped: true}));
        }, 475);
    }, 125);
}

window.clearInterval(window.loadingInterval);

const iInterval = window.setInterval(() => {
    const iMaxHeight = window.innerHeight - Math.floor(window.innerHeight / 3);
    if (window.iHeight >= iMaxHeight) {
        window.iHeight = iMaxHeight;
        window.clearInterval(iInterval);
    } else {
        window.iHeight += 4;
    }

    window.draw();
}, (1000 / 60));