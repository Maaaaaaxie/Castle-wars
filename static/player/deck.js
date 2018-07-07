define(() => {
	"use strict";

	const sImg = "https://cdn2.iconfinder.com/data/icons/outlined-valuable-items/200/minerals_pure_silver-512.png";

	const aAttackCards = [
		{
			id: 0,
			icon: sImg,
			resourceCount: 4,
			category: "Verteidigung",
			target: "Turm",
			value: "+5",
			class: "attack"
		}, {
			id: 1,
			icon: sImg,
			resourceCount: 4,
			category: "Verteidigung",
			target: "Turm",
			value: "+5",
			class: "attack"
		}, {
			id: 2,
			icon: sImg,
			resourceCount: 4,
			category: "Verteidigung",
			target: "Turm",
			value: "+5",
			class: "attack"
		}, {
			id: 3,
			icon: sImg,
			resourceCount: 4,
			category: "Verteidigung",
			target: "Turm",
			value: "+5",
			class: "attack"
		}, {
			id: 4,
			icon: sImg,
			resourceCount: 4,
			category: "Verteidigung",
			target: "Turm",
			value: "+5",
			class: "attack"
		}
	];

	const aDefendCards = [
		{
			id: 5,
			icon: sImg,
			resourceCount: 4,
			category: "Verteidigung",
			target: "Turm",
			value: "+5",
			class: "defend"
		}, {
			id: 6,
			icon: sImg,
			resourceCount: 4,
			category: "Verteidigung",
			target: "Turm",
			value: "+5",
			class: "defend"
		}, {
			id: 7,
			icon: sImg,
			resourceCount: 4,
			category: "Verteidigung",
			target: "Turm",
			value: "+5",
			class: "defend"
		}
	];

	return {
		attack: aAttackCards,
		defend: aDefendCards
	};
});