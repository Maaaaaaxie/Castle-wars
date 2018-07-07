requirejs(["./cardRenderer"], function(CardRenderer) {
	"use strict";

	{
		let bMoveAllowed = true;

		/**
		 * Called when the user clicks on the card section
		 * @param {MouseEvent} e
		 * @param {MouseEvent.target} e.target
		 */
		document.getElementById("cards").onclick = e => {
			if (!bMoveAllowed) {
				return;
			}

			if (e && e.target && (e.target.classList.contains("card_face") || e.target.parentElement.classList.contains("card_face"))) {
				// card_face || sub element of card_face
				e.target.closest(".scene_inner") && e.target.closest(".scene_inner").classList.toggle("is-flipped");

				// TODO: add some real logic to prevent new move being made (only one card can be selected)
				// bMoveAllowed = false;
				// window.setTimeout(() => bMoveAllowed = true, 2000);
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