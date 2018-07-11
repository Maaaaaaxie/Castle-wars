define(() => {
	"use strict";

	/**
	 * @define class Timer
	 */
	return class Timer {
		static start() {
			const oTimer = document.getElementById("timer");
			if (!oTimer) {
				throw new Error("Unable to start timer: timer element not found");
			}

			let iTime = 5;
			oTimer.innerText = iTime.toString();
			window.countdown = window.setInterval(() => {
				if (iTime > 0) {
					iTime--;
					oTimer.innerText = iTime.toString();
				} else {
					console.log("Timer finished");
					window.clearInterval(window.countdown);
					delete window.countdown;
				}
			}, 1000);
		}
		static stop() {
			if (window.countdown) {
				window.clearInterval(window.countdown);
				delete window.countdown;
			}
		}
	}
});