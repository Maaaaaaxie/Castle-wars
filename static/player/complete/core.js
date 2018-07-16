import Information from "/modules/information.js";
import Resources from "/modules/resources.js";
import Cards from "/modules/cards.js";
import GameEngine from "/modules/gameEngine.js";

console.log("Rendering player view");

window.setTimeout(() => {
	// clear loading animation
	document.getElementById("canvas").classList.add("hidden");

	window.setTimeout(() => {
		window.clearInterval(window.loadingInterval);
		document.body.removeChild(document.getElementById("canvas"));

		// add the information area to the page
		document.body.appendChild(Information.render());
		// Information.start();

		// add the resources area to the page
		document.body.appendChild(Resources.render());
		// window.setTimeout(() => Resources.setHealth(37), 1000);

		document.body.appendChild(Cards.render());
		Cards.renderCard(1);

		// TODO: connect
		// on game start: start game engine with player id
	}, 475);
}, 250);