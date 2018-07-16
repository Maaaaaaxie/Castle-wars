import Information from "/modules/information.js";
import Resources from "/modules/resources.js";
import Cards from "/modules/cards.js";

const socket = io();
window.socket = socket;

/**
 * socket.on
 * - join ("Spieler [1/2]")
 * - start ()
 * - leave ()
 * - clientUpdate ({Player)
 * - playerUpdate ({Player})
 */

// fired when the player has joined the game
socket.on("join", sPlayerId => {
	console.log("Joined game, player has id", sPlayerId);
	startGame(sPlayerId);
	// debugger;
	// const imgStatus = document.getElementById("infotext").getElementsByTagName("img")[0];
	// const txtPlayer = document.getElementById("infotext").getElementsByTagName("span")[0];
	// if (sPlayerId) {
	// 	imgStatus.src = "/images/basic/wifi.png";
	// 	txtPlayer.innerText = sPlayerId;
	// 	document.getElementById("information").classList.add("joined");
	// } else {
	// 	txtPlayer.innerText = "";
	// 	imgStatus.src = "/images/basic/no-wifi.png";
	// 	document.getElementById("information").classList.remove("joined");
	// }
});

socket.on("clientUpdate", o => {
	//
});

socket.on("playerUpdate", i => {

});

// fired when the connection is lost
socket.on("leave", () => {
	console.log("Left the game");
	// debugger;
	// document.getElementById("infotext").getElementsByTagName("img")[0].src = "/images/basic/no-wifi.png";
	// document.getElementById("infotext").getElementsByTagName("span")[0].innerText = "";
	// document.getElementById("information").classList.remove("joined");
});

// fired when the game starts
socket.on("start", oInfo => {
	console.log("The game has started");

	for (const scene of document.getElementsByClassName("scene_inner")) {
		scene.classList.toggle("is-flipped")
	}

	// debugger;
	//TODO show cards on start
	// const txtPlayer = document.getElementById("infotext").getElementsByTagName("span")[1].innerText = "Spiel gestartet"; //TODO remove
});

// try to connect to the server and start the websocket
socket.emit("clientConnect", {});

function startGame(nPlayerId) {
	// hide loading canvas animation of the castle
	window.setTimeout(() => {
		// fade out the canvas
		document.getElementById("canvas").classList.add("hidden");

		// after the fade out animation has finished, we...
		window.setTimeout(() => {
			window.clearInterval(window.loadingInterval); // ... clear the drawing interval call...
			document.body.removeChild(document.getElementById("canvas")); // ... and remove the canvas element from the document

			// then, all the necessecary parts/wrappers are rendered:
			document.body.appendChild(Information.render(nPlayerId)); // the information part on the top
			document.body.appendChild(Resources.render()); // the resources in the middle
			document.body.appendChild(Cards.render()); // and the card area on the bottom

			// render some placeholder cards
			[ "001", "002", "003", "004", "005", "006", "007", "008" ].forEach(e => Cards.renderCard(e, false)); // TODO: false to hide at start


		}, 475);
	}, 250);
}