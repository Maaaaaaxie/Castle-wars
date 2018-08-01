import CSSLoader from "/modules/CSSLoader.js";

// import stylesheet necessary for this section
CSSLoader.loadStyleSheet("/player/resources", "resources");

const aStats = [
	{
		class: "health",
		properties: [{
			id: "propCastle",
			name: "Burg",
			image: "http://simpleicon.com/wp-content/uploads/castle.png",
			value: 0
		}, {
			id: "propFence",
			name: "Zaun",
			image: "https://cdn.icon-icons.com/icons2/583/PNG/512/yard-fence_icon-icons.com_55051.png",
			value: 0
		}]
	}, {
		class: "stone",
		properties: [{
			id: "propBuilder",
			name: "Baumeister",
			image: "https://d30y9cdsu7xlg0.cloudfront.net/png/543-200.png",
			value: 0
		}, {
			id: "propStones",
			name: "Steine",
			image: "https://png.icons8.com/metro/1600/rock.png",
			value: 0
		}]
	}, {
		class: "weapon",
		properties: [{
			id: "propSoldiers",
			name: "Soldaten",
			image: "https://www.ccri.edu/about/images/knight_icon.svg",
			value: 0
		}, {
			id: "propWeapons",
			name: "Waffen",
			image: "http://icons.iconarchive.com/icons/icons8/windows-8/256/Military-Sword-icon.png",
			value: 0
		}]
	}, {
		class: "crystal",
		properties: [{
			id: "propMages",
			name: "Magier",
			image: "http://downloadicons.net/sites/default/files/witch%27s-hat-icon-75504.png",
			value: 0
		}, {
			id: "propCrystals",
			name: "Kristalle",
			image: "https://d30y9cdsu7xlg0.cloudfront.net/png/7374-200.png",
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

	static setHealth(iNewHealth, bCastle = true) {
		document.getElementById(bCastle ? "propCastle" : "propFence").innerText = iNewHealth.toString();
	}

	static setStone(iNewHealth, bBuilder = true) {
		document.getElementById(bBuilder ? "propBuilder" : "propStones").innerText = iNewHealth.toString();
	}

	static setWeapon(iNewHealth, bSoldiers = true) {
		document.getElementById(bSoldiers ? "propSoldiers" : "propWeapons").innerText = iNewHealth.toString();
	}

	static setCrystal(iNewHealth, bMages = true) {
		document.getElementById(bMages ? "propMages" : "propCrystals").innerText = iNewHealth.toString();
	}
}