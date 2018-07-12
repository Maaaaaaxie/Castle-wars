define(["../complete/cssLoader", "../../util/ajax"], (CSSLoader, AJAX) => {
	"use strict";

	// import stylesheet necessary for this section
	CSSLoader.loadStyleSheet("/player/resources", "resources");

	function createProperty(oProperty) {
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
		oValue.setAttribute("class", "propertyValue");
		oValue.innerText = oProperty.value;

		oAside.appendChild(oDescription);
		oAside.appendChild(oValue);
		return oAside;
	}

	function renderStat(aStats, sClass) {
		if (!Array.isArray(aStats) && aStats.length !== 2) {
			throw new Error("A pair of stats must be provided");
		}

		const oArticle = document.createElement("article");
		oArticle.setAttribute("class", `stat ${sClass}`);

		oArticle.appendChild(createProperty(aStats[0]));
		oArticle.appendChild(createProperty(aStats[1]));
		return oArticle;
	}

	const oNav = document.createElement("nav");
	oNav.setAttribute("id", "stats_resources");

	const oStats = document.createElement("section");
	oStats.setAttribute("id", "stats");
	oNav.appendChild(oStats);

	oStats.appendChild(renderStat([{
		name: "Burg",
		image: "http://simpleicon.com/wp-content/uploads/castle.png",
		value: 20
	}, {
		name: "Zaun",
		image: "https://cdn.icon-icons.com/icons2/583/PNG/512/yard-fence_icon-icons.com_55051.png",
		value: 10
	}], "health"));

	const oResources = document.createElement("section");
	oResources.setAttribute("id", "resources");
	oNav.appendChild(oResources);

	oResources.appendChild(renderStat([
		{
			name: "Baumeister",
			image: "https://d30y9cdsu7xlg0.cloudfront.net/png/543-200.png",
			value: 2
		}, {
			name: "Steine",
			image: "https://png.icons8.com/metro/1600/rock.png",
			value: 8
		}
	], "stone"));

	oResources.appendChild(renderStat([
		{
			name: "Soldaten",
			image: "https://www.ccri.edu/about/images/knight_icon.svg",
			value: 2
		}, {
			name: "Waffen",
			image: "http://icons.iconarchive.com/icons/icons8/windows-8/256/Military-Sword-icon.png",
			value: 8
		}
	], "weapon"));

	oResources.appendChild(renderStat([
		{
			name: "Magier",
			image: "http://downloadicons.net/sites/default/files/witch%27s-hat-icon-75504.png",
			value: 2
		}, {
			name: "Kristalle",
			image: "https://d30y9cdsu7xlg0.cloudfront.net/png/7374-200.png",
			value: 8
		}
	], "crystal"));

	document.body.appendChild(oNav);
});