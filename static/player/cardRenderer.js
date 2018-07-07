define(["deck"], (oCards) => {
	return class cardRenderer {
		constructor(oCardContainer) {
			if (!oCardContainer) {
				throw new Error("Can not render cards without a container");
			}

			this._cardContainer = oCardContainer;
		}
		// TODO: is-flipped = true by default
		render(nCard, bFlipped = false) {
			const oCard = oCards.attack.find(e => e.id === nCard) || oCards.defend.find(e => e.id === nCard);
			if (!oCard) {
				throw new Error("Could not find card with id " + nCard + ". Rendering not possible");
			}

			const oArticle = document.createElement("article");
			oArticle.setAttribute("class", "card");
			oArticle.setAttribute("data-id", nCard);

			const oScene = document.createElement("div");
			oScene.setAttribute("class", "scene");
			oArticle.appendChild(oScene);

			const oSceneInner = document.createElement("div");
			oSceneInner.setAttribute("class", `scene_inner ${bFlipped ? "is-flipped" : ""} ${oCard.class}`);
			oScene.appendChild(oSceneInner);

			oSceneInner.appendChild(this._createFront(oCard));

			const oBack = document.createElement("div");
			oBack.setAttribute("class", "card_face back");
			oBack.innerText = "Back";
			oSceneInner.appendChild(oBack);

			this._cardContainer.appendChild(oArticle);
		}
		_createFront(oCard) {
			const oFront = document.createElement("div");
			oFront.setAttribute("class", "card_face front");

			// Header
			const oHeader = document.createElement("header");
			oFront.appendChild(oHeader);

			const oImg = document.createElement("img");
			oImg.setAttribute("class", "_icon");
			oImg.setAttribute("src", oCard.icon);
			oHeader.appendChild(oImg);

			const oResourceCount = document.createElement("span");
			oResourceCount.setAttribute("class", "_resourceCount");
			oResourceCount.innerText = oCard.resourceCount.toString();
			oHeader.appendChild(oResourceCount);

			// middle
			const oSection = document.createElement("section");
			oSection.innerText = oCard.category;
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
		_removeCard(nCard) {
			const oCards = document.getElementsByClassName("card");

			for (const _card in oCards) {
				let oCard = oCards[_card];
				if (oCards && oCards.hasOwnProperty(_card) && parseInt(oCard.getAttribute("data-id"), 10) === nCard) {
					console.log("Deleting Card", oCard);
					oCard.parentNode.removeChild(oCard);
					break;
				}
			}
		}
	}
});