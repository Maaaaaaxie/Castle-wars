import Information from "/modules/Information.js";
import Resources from "/modules/Resources.js";
import Cards from "/modules/Cards.js";

const socket = window.socket = io();
window.player = {};
window._moveAllowed = false;
window._cards = [];

/**
 * socket.on
 * - init ({ id, game{ active, state }, players[] })
 * - start ()
 * - turn (iTime, iActive)
 * - done ()
 * - leave ()
 * - playerUpdate ([ player1, player2 ])
 */

socket.on("init", o => {
    console.log("Joined game", o);
	window.player = o.players.find(e => e.id === o.id);

	startGame(window.player);
});

// fired when the game starts
socket.on("start", () => {
	console.log("The game has started");

	Cards.unfoldAll();
});

socket.on("turn", iTime => {
	//TODO check if you are active
	console.log("turn");

	Information.turn(iTime);
});

socket.on("done", () => {
	console.log("Move finished");

	Information.stop();
	window._moveAllowed = false;
});

socket.on("playerUpdate", a => {
	console.log("playerUpdate", a);

	const oPlayer = a.find(e => e.number === window.player.number);

	window.setTimeout(() => {
		Resources.update(oPlayer);
		const
			aCurrentCards = Cards.getCurrentCards(),
			aNewCards = oPlayer.cards;

		if (aCurrentCards.length < 8) {
			aCurrentCards.forEach(e => aNewCards.splice(aNewCards.indexOf(e), 1));

			Cards.renderCard({ sCardId: aNewCards[0], oPlayer });
		}

		aCurrentCards.forEach(e => Cards.updateStatus(e, oPlayer));
	}, 500);
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
	// hide loading canvas animation of the castle
	window.setTimeout(() => {
		// fade out the canvas
		document.getElementById("canvas").parentElement.classList.add("hidden");
		document.body.removeChild(document.getElementById("centerWrapper"));

		// after the fade out animation has finished, we...
		window.setTimeout(() => {
			// window.clearInterval(window.loadingInterval); // ... clear the drawing interval call...
			document.body.removeChild(document.getElementById("canvas").parentElement); // ... and remove the canvas element from the document

			// then, all the necessecary parts/wrappers are rendered:
			document.body.appendChild(Information.render(window.player.number)); // the information part on the top
			document.body.appendChild(Resources.render()); // the resources in the middle
			document.body.appendChild(Cards.render()); // and the card area on the bottom

			// set the resources
			Resources.update(oPlayer);

			// render the deck
			oPlayer.cards.forEach(sCardId => Cards.renderCard({ sCardId, oPlayer, bFlipped: true }));
		}, 475);
	}, 250);
}

// loaded, show join button
function enterFullscreen(oElement) {
	if(oElement.requestFullscreen) {
		oElement.requestFullscreen();
	} else if(oElement.mozRequestFullScreen) {
		oElement.mozRequestFullScreen();
	} else if(oElement.msRequestFullscreen) {
		oElement.msRequestFullscreen();
	} else if(oElement.webkitRequestFullscreen) {
		oElement.webkitRequestFullscreen();
	}
}
window.clearInterval(window.loadingInterval);

const iInterval = window.setInterval(() => {
	const iMaxHeight = window.innerHeight - Math.floor(window.innerHeight / 3);
	if (window.iHeight >= iMaxHeight) {
		window.iHeight = iMaxHeight;
		window.clearInterval(iInterval);

		const oJoinButton = document.getElementById("launchButton");
		oJoinButton.style.display = "block";
		oJoinButton.addEventListener("click", e => {
			// enterFullscreen(document.documentElement); // TODO: uncomment
			socket.emit("join");
			oJoinButton.disabled = true;
		});
	} else {
		window.iHeight += 4;
	}

	window.draw();
}, (1000 / 60));