import CSSLoader from "/modules/CSSLoader.js";
import AJAX from "/modules/Ajax.js";

// import stylesheet necessary for this section
CSSLoader.loadStyleSheet("/player/cards", "cards");

const oCardPromise = AJAX.getCards();
const oImages = {
	"castle": "http://simpleicon.com/wp-content/uploads/castle.png",
	"fence": "https://cdn.icon-icons.com/icons2/583/PNG/512/yard-fence_icon-icons.com_55051.png",
	"builders": "https://d30y9cdsu7xlg0.cloudfront.net/png/543-200.png",
	"stones": "https://png.icons8.com/metro/1600/rock.png",
	"soldiers": "https://www.ccri.edu/about/images/knight_icon.svg",
	"weapons": "http://icons.iconarchive.com/icons/icons8/windows-8/256/Military-Sword-icon.png",
	"mages": "http://downloadicons.net/sites/default/files/witch%27s-hat-icon-75504.png",
	"crystals": "https://d30y9cdsu7xlg0.cloudfront.net/png/7374-200.png"
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
	"crystals": "Kristalle"
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
		oSection.onclick = e => {
			if (!bMoveAllowed) {
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
					discard: false
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
			if (!bMoveAllowed) {
				return false;
			}

			const
				oSceneInner = e.target.closest(".scene_inner"),
				oCard = e.target.closest(".card");

			if (oSceneInner && !oSceneInner.classList.contains("vanished") && oCard.classList.contains("disabled")) {
				const sCardId = oCard.getAttribute("data-id");
				const bDiscard = confirm("Discard this card?");
				if (bDiscard) {
					console.log("Discarding card", sCardId);
					bMoveAllowed = false;
					oSceneInner.classList.add("vanished");
					window.socket.emit("card", {
						id: sCardId,
						discard: true
					});
					window.setTimeout(() => {
						this.removeCard(oSceneInner);
						bMoveAllowed = true;
					}, 500);
				}


				// window.socket.emit("card", sCardId);
				// bMoveAllowed = false;
				// oSceneInner.classList.add("vanished");
				// window.setTimeout(() => {
				// 	this.removeCard(oSceneInner);
				// 	bMoveAllowed = true;
				// }, 500);
			}

			return false;
		}
	}

	static removeCard(oSceneInner) {
		oSceneInner.closest(".card").parentElement.removeChild(oSceneInner.closest(".card"));
	}

	// TODO: cards flipped at start
	static renderCard({ sCardId, bFlipped = false, oPlayer } = {}) {
	// static renderCard(sCardId, bPlayable = true, bFlipped = false) {
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
		for (const p in oCard.enemy) {
			oCard.enemy.hasOwnProperty(p) && oCard.enemy[p] !== 0 && aProperties.push(p);
		}
		if (aProperties.length > 0) {
			aProperties.forEach(e => {
				const oText = document.createElement("div");
				oText.innerText = (oTexts[e] ? oTexts[e] : "Attacke") + " " + oCard.enemy[e];
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
}