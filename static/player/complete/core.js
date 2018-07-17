import Information from "/modules/Information.js";
import Resources from "/modules/Resources.js";
import Cards from "/modules/Cards.js";

// TODO: discard cards

const socket = io();
window.socket = socket;
window.nPlayer = 0;

/**
 * socket.on
 * - join ({ numbre[1/2], Player[{}] })
 * - start ()
 * - turn (iTime)
 * - done ()
 * - leave ()
 * - playerUpdate ({Player1, Player2})
 */

// fired when the player has joined the game
socket.on("join", (oPlayer) => {
	console.log("Joined game", oPlayer);
	window.nPlayer = oPlayer.number;
	startGame(oPlayer);
});

// fired when the game starts
socket.on("start", () => {
	console.log("The game has started");

	for (const scene of document.getElementsByClassName("scene_inner")) {
		scene.classList.remove("is-flipped");
	}
});

socket.on("turn", iTime => {
	Information.start(iTime);
});

socket.on("done", () => {
	Information.stop();
});

socket.on("playerUpdate", o => {
	console.log("playerUpdate", o);

	const oPlayer = o["player" + window.nPlayer];

	window.setTimeout(() => {
		setResources(oPlayer);
		document.body.appendChild(Cards.render());
		o["player" + window.nPlayer].cards.forEach(sCardId => Cards.renderCard({ sCardId, oPlayer }));
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

// try to connect to the server and start the websocket
socket.emit("clientConnect", {});

function setResources(oPlayer) {
	Resources.setHealth(oPlayer.castle);
	Resources.setHealth(oPlayer.fence, false);
	Resources.setWeapon(oPlayer.soldiers);
	Resources.setWeapon(oPlayer.weapons, false);
	Resources.setStone(oPlayer.builders);
	Resources.setStone(oPlayer.stones, false);
	Resources.setCrystal(oPlayer.mages);
	Resources.setCrystal(oPlayer.crystals, false);
}

function startGame(oPlayer) {
	// hide loading canvas animation of the castle
	window.setTimeout(() => {
		// fade out the canvas
		document.getElementById("canvas").classList.add("hidden");

		// after the fade out animation has finished, we...
		window.setTimeout(() => {
			window.clearInterval(window.loadingInterval); // ... clear the drawing interval call...
			document.body.removeChild(document.getElementById("canvas")); // ... and remove the canvas element from the document

			// then, all the necessecary parts/wrappers are rendered:
			document.body.appendChild(Information.render(window.nPlayer)); // the information part on the top
			document.body.appendChild(Resources.render()); // the resources in the middle
			document.body.appendChild(Cards.render()); // and the card area on the bottom

			// set the resources
			setResources(oPlayer);

			// render the deck
			oPlayer.cards.forEach(sCardId => Cards.renderCard({ sCardId, oPlayer, bFlipped: true }));
		}, 475);
	}, 250);
}