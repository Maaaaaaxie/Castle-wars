requirejs(["./cardRenderer"], function(CardRenderer) {
	"use strict";

	{
		let bMoveAllowed = true;

		/**
		 * Called when the user clicks on the card section
		 * @param {MouseEvent} e
		 * @param {MouseEvent.target} e.target
		 */
		document.getElementById("cards").onclick = function(e) {
			if (!bMoveAllowed) {
				return;
			}

			const oSceneInner = e.target.closest(".scene_inner");
			if (oSceneInner) {
				oSceneInner.classList.toggle("is-flipped");
			}
		}
	}

	// renderer
	{
		const oCardRenderer = new CardRenderer(document.getElementById("cards_inner"));
		[0,1,2,3,4,5,6,7].forEach(e => oCardRenderer.render(e));

		oCardRenderer._removeCard(2);
	}
});