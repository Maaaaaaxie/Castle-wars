import CSSLoader from "/modules/cssLoader.js";
import AJAX from "/modules/ajax.js";

// import stylesheet necessary for this section
CSSLoader.loadStyleSheet("/player/cards", "cards");

const oCardPromise = AJAX.getCards();
const oImages = {
	"castle": "http://simpleicon.com/wp-content/uploads/castle.png",
	"fence": "https://cdn.icon-icons.com/icons2/583/PNG/512/yard-fence_icon-icons.com_55051.png",
	"builder": "https://d30y9cdsu7xlg0.cloudfront.net/png/543-200.png",
	"stone": "https://png.icons8.com/metro/1600/rock.png",
	"soldiers": "https://www.ccri.edu/about/images/knight_icon.svg",
	"weapons": "http://icons.iconarchive.com/icons/icons8/windows-8/256/Military-Sword-icon.png",
	"mages": "http://downloadicons.net/sites/default/files/witch%27s-hat-icon-75504.png",
	"crystals": "https://d30y9cdsu7xlg0.cloudfront.net/png/7374-200.png"
};
let bMoveAllowed = true;

export default class Cards {
	static render() {
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

			const oSceneInner = e.target.closest(".scene_inner");
			if (oSceneInner && !oSceneInner.classList.contains("is-flipped")) {
				bMoveAllowed = false;
				oSceneInner.classList.add("is-flipped");
				window.setTimeout(() => {
					this.removeCard(oSceneInner);
					bMoveAllowed = true;
				}, 500);
			}
		};
	}

	static removeCard(oSceneInner) {
		oSceneInner.closest(".card").parentElement.removeChild(oSceneInner.closest(".card"));
	}

	static renderCard(nCard) {
		oCardPromise.then(aCards => {
			const oCard = aCards.find(e => Number.parseInt(e.id, 10) === Number.parseInt(nCard, 10));

			if (oCard) {
				const oArticle = document.createElement("article");
				oArticle.setAttribute("class", "card");
				oArticle.setAttribute("data-id", nCard);

				const oScene = document.createElement("div");
				oScene.setAttribute("class", "scene");
				oArticle.appendChild(oScene);

				const oSceneInner = document.createElement("div");
				oSceneInner.setAttribute("class", `scene_inner ${oCard.category.toLowerCase()}`);
				oScene.appendChild(oSceneInner);

				oSceneInner.appendChild(this._createFront(oCard));

				document.getElementById("cards_inner").appendChild(oArticle);
			} else {
				throw new Error("Could not find card with id " + nCard + ". Rendering not possible");
			}
		});
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
		oResourceCount.innerText = this.getResourceCount(oCard);
		oHeader.appendChild(oResourceCount);

		// middle
		const oSection = document.createElement("section");
		// oSection.innerText = oCard.category;
		oSection.innerText = oCard.name;
		oFront.appendChild(oSection);

		// footer
		const oTarget = document.createElement("span");
		oTarget.innerText = oCard.target;

		const oSpace = document.createElement("span");
		oSpace.innerText = " ";

		const oValue = document.createElement("span");
		oValue.innerText = oCard.value;

		const oFooter = document.createElement("footer");
		oFooter.appendChild(oTarget);
		oFooter.appendChild(oSpace);
		oFooter.appendChild(oValue);
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