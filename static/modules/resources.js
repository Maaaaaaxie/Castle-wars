import CSSLoader from "/modules/cssLoader.js";

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

		// stats
		const oStats = document.createElement("section");
		oStats.setAttribute("id", "stats");
		oNav.appendChild(oStats);

		oStats.appendChild(this.renderStat(aStats[0]));

		// resources
		const oResources = document.createElement("section");
		oResources.setAttribute("id", "resources");
		oNav.appendChild(oResources);

		oResources.appendChild(this.renderStat(aStats[1]));
		oResources.appendChild(this.renderStat(aStats[2]));
		oResources.appendChild(this.renderStat(aStats[3]));

		return oNav;
	}

	static renderStat(oStat) {
		const oArticle = document.createElement("article");
		oArticle.setAttribute("class", `stat ${oStat.class}`);

		oArticle.appendChild(this.renderProperty(oStat.properties[0]));
		oArticle.appendChild(this.renderProperty(oStat.properties[1]));

		return oArticle;
	}

	static renderProperty(oProperty) {
		const oAside = document.createElement("aside");
		oAside.setAttribute("class", "property");

		// description
		const oDescription = document.createElement("div");
		oDescription.setAttribute("class", "description");

		const oImgParent = document.createElement("div");
		const oImg = document.createElement("img");
		oImg.setAttribute("src", oProperty.image);
		oImgParent.appendChild(oImg);

		const oNameParent = document.createElement("div");
		oNameParent.setAttribute("class", "noMarginTop");
		const oSpan = document.createElement("span");
		oSpan.innerText = oProperty.name;
		oNameParent.appendChild(oSpan);

		oDescription.appendChild(oImgParent);
		oDescription.appendChild(oNameParent);

		// value
		const oValue = document.createElement("div");
		oValue.setAttribute("id", oProperty.id);
		oValue.setAttribute("class", "propertyValue");
		oValue.innerText = oProperty.value;

		oAside.appendChild(oDescription);
		oAside.appendChild(oValue);
		return oAside;
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