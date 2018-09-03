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

		const oTimerAndSettings = document.createElement("article");
		oTimerAndSettings.setAttribute("class", "timerSettings");
		oSection.appendChild(oTimerAndSettings);

		const oTimer = document.createElement("span");
		oTimer.setAttribute("id", "timer");
		oTimer.innerText = "-";
		oTimerAndSettings.appendChild(oTimer);

		const btnSettings = document.createElement("button");
		btnSettings.setAttribute("id", "settingsBtn");
		btnSettings.addEventListener("click", () => document.getElementById("settings").showModal());
		oTimerAndSettings.appendChild(btnSettings);

		return oSection;
	}

	// TODO: deprecated
	// static setTurn(bCurrentPlayer = true) {
	// 	const oActivePlayer = document.getElementById("currentPlayer");
	// 	if (bCurrentPlayer) {
	// 		oActivePlayer.innerText = "Du bist dran!";
	// 	} else {
	// 		oActivePlayer.innerText = "Dein Gegner ist dran!";
	// 	}
	// }

	static turn(iTime) {
		this.notify();
		this.start(iTime);
	}

	// flashes the top area of the player screen
	static notify() {
		const oInfo = document.getElementById("information");

		oInfo.classList.add("notify");
		window._settings.vibrate && window.navigator.vibrate && window.navigator.vibrate(140);
		window.setTimeout(() => oInfo.classList.remove("notify"), 1000);
	}

	// starts the timer in the upper right corner
	static start(iTimeLeft = 10) {
		const oTimer = document.getElementById("timer");
		if (!oTimer) {
			throw new Error("Unable to start timer: timer element not found");
		}

		window._moveAllowed = true;

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

	// stops/pauses the timer
	static stop(bHideTimeLeft = true) {
		const oTimer = document.getElementById("timer");
		if (!oTimer) {
			throw new Error("Unable to stop timer: timer element not found");
		}

		window._moveAllowed = false;

		if (window.countdown) {
			window.clearInterval(window.countdown);
			delete window.countdown;
			if (bHideTimeLeft) {
				oTimer.innerText = "-";
			}
		}
	}
}