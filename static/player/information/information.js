define(["../complete/cssLoader"], (CSSLoader) => {
	"use strict";

	// import stylesheet necessary for this section
	CSSLoader.loadStyleSheet("/player/information", "information");

	const oSection = document.createElement("section");
	oSection.setAttribute("id", "information");

	const oInfoText = document.createElement("article");
	oInfoText.setAttribute("id", "infotext");
	oSection.appendChild(oInfoText);

	// TODO: oInfo needs an ID so the text can be updated
	const oInfo = document.createElement("span");
	oInfo.innerText = "Du bist dran!";
	oInfoText.appendChild(oInfo);

	const oTimer = document.createElement("article");
	oTimer.setAttribute("id", "timer");
	oTimer.innerText = 30;
	oSection.appendChild(oTimer);

	// TODO: create/add Timer function

	return oSection;

	/* oSection:
		<section id="information">
			<article id="infotext">
				<span>Du bist dran!</span>
			</article>
			<article id="timer">30</article>
		</section>
	*/
});