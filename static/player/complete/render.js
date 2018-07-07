requirejs(["./title"/*, "./cards", "./stats"*/], (Title, Cards, Stats) => {
	"use strict";

	console.log("Rendering player view");

	document.body.appendChild(Title);
});