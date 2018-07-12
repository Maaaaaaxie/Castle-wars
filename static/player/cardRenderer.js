define(["deck" ,"../../util/ajax"], (oCards, AJAX) => {
	return class cardRenderer {
		constructor(oCardContainer) {
			if (!oCardContainer) {
				throw new Error("Can not render cards without a container");
			}

			this._cards = AJAX.getCards();

			this._cardContainer = oCardContainer;
		}
		// TODO: is-flipped = true by default
		render(nCard, bFlipped = false) {
			this._cards.then(oCards => {
				const oCard = oCards.find(e => Number.parseInt(e.id, 10) === Number.parseInt(nCard, 10));

				if (oCard) {
					const oArticle = document.createElement("article");
					oArticle.setAttribute("class", "card");
					oArticle.setAttribute("data-id", nCard);

					const oScene = document.createElement("div");
					oScene.setAttribute("class", "scene");
					oArticle.appendChild(oScene);

					const oSceneInner = document.createElement("div");
					oSceneInner.setAttribute("class", `scene_inner ${bFlipped ? "is-flipped" : ""} ${oCard.category.toLowerCase()}`);
					oScene.appendChild(oSceneInner);

					oSceneInner.appendChild(this._createFront(oCard));

					const oBack = document.createElement("div");
					oBack.setAttribute("class", "card_face back");
					oBack.innerText = "Back";
					oSceneInner.appendChild(oBack);

					this._cardContainer.appendChild(oArticle);
				} else {
					throw new Error("Could not find card with id " + nCard + ". Rendering not possible");
				}
			});
		}
		_getResourceCount(oProperty) {
			let aResources = [];
			for (let prop in oProperty) {
				if (oProperty.hasOwnProperty(prop)) {
					if (oProperty[prop] !== 0) {
						aResources.push({
							[prop]: oProperty[prop]
						});
					}
				}
			}
			return aResources;
		}
		_createFront(oCard) {
			const oFront = document.createElement("div");
			oFront.setAttribute("class", "card_face front");

			// Header
			const oHeader = document.createElement("header");
			oFront.appendChild(oHeader);

			const oImg = document.createElement("img");
			oImg.setAttribute("class", "_icon");
			oImg.setAttribute("src", oCard.image);
			oHeader.appendChild(oImg);

			// TODO
			const
				oResourcesSelf = this._getResourceCount(oCard.self),
				oResourcesEnemy = this._getResourceCount(oCard.enemy),
				oResourcesCosts = this._getResourceCount(oCard.costs);

			debugger;
			const oResourceCount = document.createElement("span");
			oResourceCount.setAttribute("class", "_resourceCount");
			oResourceCount.innerText = oResourcesCosts[0][0];
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
		_removeCard(nCard) {
			this._cards.then(() => {
				const oCards = document.getElementsByClassName("card");

				for (const oCard of oCards) {
					if (Number.parseInt(oCard.getAttribute("data-id"), 10) === Number.parseInt(nCard, 19)) {
						console.log("Deleting Card", oCard);
						oCard.parentNode.removeChild(oCard);
						return;
					}
				}
			});
		}
	}
});