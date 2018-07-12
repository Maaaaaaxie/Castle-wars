define(["../complete/cssLoader", "./timer"], (CSSLoader, Timer) => {
	"use strict";

	// import stylesheet necessary for this section
	CSSLoader.loadStyleSheet("/player/information", "information");

	/**
	 * @define class Information
	 */
	return class Information extends Timer {
		static render() {
			/* oSection:
				<section id="information">
					<article id="infotext">
						<span>Du bist dran!</span>
					</article>
					<article id="timer">30</article>
				</section>
			*/

			const oSection = document.createElement("section");
			oSection.setAttribute("id", "information");

			const oInfoText = document.createElement("article");
			oInfoText.setAttribute("id", "infotext");
			oSection.appendChild(oInfoText);

			const oInfo = document.createElement("span");
			oInfo.setAttribute("id", "currentPlayer");
			oInfo.innerText = "Du bist dran!";
			oInfoText.appendChild(oInfo);

			const oTimer = document.createElement("article");
			oTimer.setAttribute("id", "timer");
			oTimer.innerText = "" + 30;
			oSection.appendChild(oTimer);

			return oSection;
		}
		static setTurn(bCurrentPlayer = true) {
			const oActivePlayer = document.getElementById("currentPlayer");
			if (bCurrentPlayer) {
				oActivePlayer.innerText = "Du bist dran!";
			} else {
				oActivePlayer.innerText = "Dein Gegner ist dran!";
			}
		}
	};
});