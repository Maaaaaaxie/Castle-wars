requirejs([
	"../information/information",
	"../resources/resources"
	/*, "./cards", "./stats"*/
], (Information, Resources, Cards, Stats) => {
	"use strict";

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

			window.setTimeout(() => Resources.setHealth(37), 1000);
		}, 475);
	}, 250);
});