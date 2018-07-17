import CSSLoader from "/modules/CSSLoader.js";

// import stylesheet necessary for this section
CSSLoader.loadStyleSheet("/player/information", "information");

/**
 * @define class Information
 */
export default class Information /*extends Timer */ {
	static render(sPlayerId) {
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
		oInfo.innerText = "Spieler " + sPlayerId;
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

	static start(iTimeLeft = 10) {
		const oTimer = document.getElementById("timer");
		if (!oTimer) {
			throw new Error("Unable to start timer: timer element not found");
		}

		oTimer.innerText = iTimeLeft.toString();
		window.countdown = window.setInterval(() => {
			if (iTimeLeft > 0) {
				iTimeLeft--;
				oTimer.innerText = iTimeLeft.toString();
			} else {
				console.log("Timer finished");
				window.clearInterval(window.countdown);
				delete window.countdown;
			}
		}, 1000);
	}

	static stop() {
		const oTimer = document.getElementById("timer");
		if (!oTimer) {
			throw new Error("Unable to start timer: timer element not found");
		}

		if (window.countdown) {
			window.clearInterval(window.countdown);
			delete window.countdown;
			oTimer.innerText = "-";
		}
	}
}