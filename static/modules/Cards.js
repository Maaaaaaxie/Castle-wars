import AJAX from "/modules/Ajax.js";

const oCardPromise = AJAX.getCards();
const oImages = {
	castle: "../images/materials/castle.png",
	fence: "../images/materials/fence.png",
	builders: "../images/materials/builder.png",
	stones: "../images/materials/stone.png",
	soldiers: "../images/materials/soldier.png",
	weapons: "../images/materials/sword.png",
	mages: "../images/materials/witch.png",
	crystals: "../images/materials/crystal.png"
};
let bMoveAllowed = true;

const oTexts = {
	"castle": "Burg",
	"fence": "Zaun",
	"builders": "Baumeister",
	"stones": "Steine",
	"soldiers": "Soldaten",
	"weapons": "Waffen",
	"mages": "Magier",
	"crystals": "Kristalle",
	"health": "Attacke"
};

export default class Cards {
	static render() {
		// remove element in case it has been rendered already
		document.getElementById("cards") && document.getElementById("cards").parentNode.removeChild(document.getElementById("cards"));

		const oSection = document.createElement("section");
		oSection.setAttribute("id", "cards");

		const oInner = document.createElement("div");
		oInner.setAttribute("id", "cards_inner");
		oSection.appendChild(oInner);

		this._registerPressHandler(oSection);

		return oSection;
	}

	static _registerPressHandler(oSection) {
		document.getElementById("dismissNo").addEventListener("click", () => {
			document.getElementById("dismissCard").close();
		});
		document.getElementById("dismissYes").addEventListener("click", () => {
			const
				oDialog = document.getElementById("dismissCard"),
				iCard = parseInt(oDialog.getAttribute("data-id"), 10),
				oSceneInner = document.getElementById("cards").firstChild.children[iCard].firstChild.firstChild; // uff

			oDialog.close();

			if (iCard) {
				console.log("Discarding card", iCard);
				bMoveAllowed = false;
				oSceneInner.classList.add("vanished");
				window.socket.emit("card", {
					id: iCard,
					discard: true,
					number: window.player.number
				});
				window.setTimeout(() => {
					this.removeCard(oSceneInner);
					bMoveAllowed = true;
				}, 500);
			}
		});

		// TODO: clean up lol
		oSection.onclick = e => {
			if (!bMoveAllowed || !window._moveAllowed) {
				return;
			}

			const
				oSceneInner = e.target.closest(".scene_inner"),
				oCard = e.target.closest(".card");

			if (oSceneInner && !oSceneInner.classList.contains("vanished") && !oCard.classList.contains("disabled")) {
				const sCardId = oCard.getAttribute("data-id");
				console.log("Played card", sCardId);
				window.socket.emit("card", {
					id: sCardId,
					discard: false,
					number: window.player.number
				});
				bMoveAllowed = false;
				oSceneInner.classList.add("vanished");
				window.setTimeout(() => {
					this.removeCard(oSceneInner);
					bMoveAllowed = true;
				}, 500);
			}
		};

		oSection.oncontextmenu = e => {
			if (!bMoveAllowed || !window._moveAllowed) {
				return false;
			}

			const
				oSceneInner = e.target.closest(".scene_inner"),
				oCard = e.target.closest(".card");

			// TODO: are only disabled cards dismissable?
			if (oSceneInner && !oSceneInner.classList.contains("vanished") && oCard.classList.contains("disabled")) {
				const iCard = Array.from(oCard.parentElement.children).indexOf(oCard);

				document.getElementById("dismissCard").setAttribute("data-id", iCard.toString());
				document.getElementById("dismissCard").showModal();
				// TODO: on time out, remove dialog if no choice has been made by user
			}

			return false;
		}
	}

	static unfoldAll() {
		let
			aCards = [],
			i = -1;

		for (const scene of document.getElementsByClassName("scene_inner")) {
			aCards.push(scene);
		}

		const iInterval = window.setInterval(() => {
			i > 5 && window.clearInterval(iInterval); // suizide
			aCards[++i].classList.remove("is-flipped");
		}, 100);
	}

	static foldAll() {
		let
			aCards = [],
			i = -1;

		for (const scene of document.getElementsByClassName("scene_inner")) {
			aCards.push(scene);
		}

		const iInterval = window.setInterval(() => {
			i > 5 && window.clearInterval(iInterval); // suizide
			aCards[++i].classList.add("is-flipped");
		}, 100);
	}

	static removeCard(oSceneInner) {
		oSceneInner.closest(".card").parentElement.removeChild(oSceneInner.closest(".card"));
	}

	static renderCard({ sCardId, bFlipped = false, oPlayer } = {}) {
		oCardPromise.then(aCards => {
			const oCard = aCards.find(e => e.id === sCardId);
			const bPlayable = this._getPlayable(oCard, oPlayer);

			if (oCard) {
				const oArticle = document.createElement("article");
				oArticle.setAttribute("class", "card" + (!bPlayable ? " disabled" : ""));
				oArticle.setAttribute("data-id", sCardId);

				const oScene = document.createElement("div");
				oScene.setAttribute("class", "scene");
				oArticle.appendChild(oScene);

				const oSceneInner = document.createElement("div");
				oSceneInner.setAttribute("class", `scene_inner ${oCard.category.toLowerCase()} ${bFlipped ? "is-flipped" : ""}`);
				oScene.appendChild(oSceneInner);

				oSceneInner.appendChild(this._createFront(oCard));

				const oBack = document.createElement("div");
				oBack.setAttribute("class", "card_face back");
				oSceneInner.appendChild(oBack);

				document.getElementById("cards_inner").appendChild(oArticle);
			} else {
				throw new Error("Could not find card with id " + sCardId + ". Rendering not possible");
			}
		});
	}

	static _getPlayable(oCard, oPlayer) {
		const sCostKey = this.getCostProperty(oCard);
		if (!sCostKey) {
			throw new Error("Unable to find cost property for card " + oCard.id);
		}

		return oPlayer[sCostKey] - (oCard.costs[sCostKey] * -1) > 0;
	}

	static _createFront(oCard) {
		const oFront = document.createElement("div");
		oFront.setAttribute("class", "card_face front");

		// Header
		const oHeader = document.createElement("header");
		oFront.appendChild(oHeader);

		const oImg = document.createElement("img");
		oImg.setAttribute("class", "_icon");
		oImg.setAttribute("src", oImages[this.getCostProperty(oCard)]);
		oHeader.appendChild(oImg);

		const oResourceCount = document.createElement("span");
		oResourceCount.setAttribute("class", "_resourceCount");
		oResourceCount.innerText = (this.getResourceCount(oCard) * -1).toString();
		oHeader.appendChild(oResourceCount);

		// middle
		const oSection = document.createElement("section");
		oSection.innerText = oCard.name;
		oFront.appendChild(oSection);

		// footer
		const oFooter = document.createElement("footer");
		let aProperties = [];
		/** @property {Number} oCard.enemy */
		for (const p in oCard.enemy) { // TODO: for of?
			oCard.enemy.hasOwnProperty(p) && oCard.enemy[p] !== 0 && aProperties.push(oTexts[p] + " " + oCard.enemy[p]);
		}
		for (const p in oCard.self) { // todo: other style, todo: plus on positive values
			oCard.self.hasOwnProperty(p) && oCard.self[p] !== 0 && aProperties.push(oTexts[p] + " +" + oCard.self[p]);
		}
		if (aProperties.length > 0) {
			aProperties.forEach(e => {
				const oText = document.createElement("div");
				// oText.innerText = oTexts[e] + " " + oCard.enemy[e];
				oText.innerText = e;
				oFooter.appendChild(oText);
			});
		}
		// TODO: for self
		oFront.appendChild(oFooter);

		return oFront;
	}

	static getResourceCount(oCard) {
		return oCard.costs[this.getCostProperty(oCard)];
	}

	static getCostProperty(oCard) {
		return Object.keys(oCard.costs).find(e => oCard.costs[e] !== 0);
	}

	static getCurrentCards() {
		const
			oCards = document.getElementsByClassName("card"),
			aCards = [];

		for (const card of oCards) {
			aCards.push(card.getAttribute("data-id"));
		}

		return aCards;
	}

	static updateStatus(nCard, oPlayer) {
		const
			that = this,
			aAllCards = document.getElementsByClassName("card"),
			aCards = [];

		for (const card of aAllCards) {
			// cards with the same id (thus same properties) may appear multiple times
			card.getAttribute("data-id") === nCard && aCards.push(card);
		}

		aCards.forEach(e => {
			oCardPromise.then(aCards => {
				const bPlayable = that._getPlayable(aCards.find(e => {
					return e.id === nCard;
				}), oPlayer);

				if (bPlayable) {
					e.classList.remove("disabled");
				} else {
					e.classList.add("disabled");
				}
			});
		});
	}
}