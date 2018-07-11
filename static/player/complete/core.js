requirejs([
	"../information/information",
	/*, "./cards", "./stats"*/
], (Information, Cards, Stats) => {
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
			Information.start();

			// window.timer.start();
		}, 475);
	}, 0);
});