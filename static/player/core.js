import Information from "/modules/Information.js";
import Resources from "/modules/Resources.js";
import Cards from "/modules/Cards.js";

const socket = window.socket = io();
const oStates = Object.freeze({
	READY: "ready",
	RUNNING: "running",
	PAUSED: "paused",
	BLOCKED: "blocked"
});
window.player = {};
window._moveAllowed = false;
window._cards = [];
window._started = false;

const btnJoin = document.getElementById("launchButton");
btnJoin.addEventListener("click", e => {
	window._settings.fullscreen && window.enterFullscreen(document.documentElement);
	socket.emit("join");
	btnJoin.disabled = true;
});

socket.on("init", o => {
    window._id = o.id;

    if (o.state === oStates.BLOCKED) {
        btnJoin.style.display = "block";
    }
});

setTimeout(()=> socket.emit("connected", "client"), 200);

socket.on("info", o => {
    window.player = o.players.find(e => e.id === window._id);

    if (window.player) {
        startGame(window.player);
    }
});

socket.on("start", () => Cards.unfoldAll());

socket.on("turn", o => {
    if (o.active === window.player.number) {
        Information.turn(o.duration);
        window._moveAllowed = true;
    }
});

socket.on("done", () => {
    Information.stop();
    window._moveAllowed = false;
});

socket.on("playerUpdate", a => {
    const oPlayer = a.find(e => e.number === window.player.number),
		aCurrentCards = Cards.getCurrentCards(),
		aNewCards = oPlayer.cards;

    Resources.update(oPlayer);

    if (aCurrentCards.length < 8) {
    	// remove all the cards from aNewCards that are displayed already
        aCurrentCards.forEach(e => aNewCards.splice(aNewCards.indexOf(e), 1));

        Cards.renderCard({
			sCardId: aNewCards[0], // draw the only card left in aNewCards (the new card)
			oPlayer
        });
    }

    // for each card, check if it can be used in the next round
    aCurrentCards.forEach(e => Cards.updateStatus(e, oPlayer));
});

socket.on("pause", o => {
	if (o.paused) {
		Information.stop(false);
		Cards.foldAll();
		window._moveAllowed = false;
	} else {
		startGame(window.player).then(() => {
			window._moveAllowed = true;
			Cards.unfoldAll();
			window.player && window.player.number === o.active && Information.start(o.remaining);
		});
	}
});

socket.on("quit", () => {
	Cards.foldAll();
	Information.stop();
});

socket.on("leave", () => window.location.reload());

function startGame(oPlayer) {
	if (window._p) {
		return window._p;
	}

	return window._p = new Promise(resolve => {
		window._started && resolve();
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

				resolve();
			}, 475);
		}, 125);
	});
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