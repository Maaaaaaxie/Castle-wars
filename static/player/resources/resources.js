define(["../complete/cssLoader", "../ajax"], (CSSLoader, AJAX) => {
	"use strict";

	// import stylesheet necessary for this section
	CSSLoader.loadStyleSheet("/player/resources", "resources");

	document.getElementsByTagName("img");
});