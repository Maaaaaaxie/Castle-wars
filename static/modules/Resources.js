const aStats = [
	{
		class: "health",
		properties: [{
			id: "propCastle",
			name: "Burg",
			image: "/images/materials/castle.png",
			value: 0
		}, {
			id: "propFence",
			name: "Zaun",
			image: "/images/materials/fence.png",
			value: 0
		}]
	}, {
		class: "stone",
		properties: [{
			id: "propBuilders",
			name: "Baumeister",
			image: "/images/materials/builder.png",
			value: 0
		}, {
			id: "propStones",
			name: "Steine",
			image: "/images/materials/stone.png",
			value: 0
		}]
	}, {
		class: "weapon",
		properties: [{
			id: "propSoldiers",
			name: "Soldaten",
			image: "/images/materials/soldier.png",
			value: 0
		}, {
			id: "propWeapons",
			name: "Waffen",
			image: "/images/materials/sword.png",
			value: 0
		}]
	}, {
		class: "crystal",
		properties: [{
			id: "propMages",
			name: "Magier",
			image: "/images/materials/witch.png",
			value: 0
		}, {
			id: "propCrystals",
			name: "Kristalle",
			image: "/images/materials/crystal.png",
			value: 0
		}]
	}
];

export default class Resources {
	static render() {
		const oNav = document.createElement("nav");
		oNav.setAttribute("id", "stats_resources");

		aStats.forEach(e => {
			const oElement = document.createElement("section");
			oElement.setAttribute("class", e.class);
			oNav.appendChild(oElement);

			oElement.appendChild(this.renderStat(e));
		});

		return oNav;
	}

	static renderStat(oStat) {
		const oWrap = document.createElement("div");

		oStat.properties.forEach(e => {
			const oArticle = document.createElement("article");
			const oImg = document.createElement("img");
			oImg.setAttribute("src", e.image);
			oArticle.appendChild(oImg);

			const oSpan = document.createElement("span");
			oSpan.setAttribute("id", e.id);
			oSpan.innerText = e.value.toString();
			oArticle.appendChild(oSpan);

			oWrap.appendChild(oArticle);
		});

		return oWrap;
	}

	static update(oPlayer) {
		[
			"Castle",
			"Fence",
			"Soldiers",
			"Weapons",
			"Builders",
			"Stones",
			"Mages",
			"Crystals"
		].forEach(e => {
			const oElement = document.getElementById(`prop${e}`);
			const sNewValue = oPlayer[e.toLowerCase()].toString();
			if (oElement.innerText !== sNewValue) {
				oElement.innerText = sNewValue;

				oElement.classList.add("notify");
				window.setTimeout(() => oElement.classList.remove("notify"), 1000);
			}
		});
	}
}