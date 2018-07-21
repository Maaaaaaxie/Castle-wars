const sBase = window.location.origin;

console.warn("Using deprecated CSSLoader");

export default class CSSLoader {
	static loadStyleSheet(sPath, sName) {
		const oStyleSheet = document.createElement("link");
		oStyleSheet.href = `${sBase}${sPath}/${sName}.css`;
		oStyleSheet.type = "text/css";
		oStyleSheet.rel = "stylesheet";

		// only add the style sheet if it has not been added already
		!this._styleSheetExists(sPath, sName) && document.getElementsByTagName("head")[0].appendChild(oStyleSheet);
	}
	static _styleSheetExists(sPath, sName) {
		const head = document.getElementsByTagName("head")[0];
		const href = `${sBase}${sPath}/${sName}.css`;
		let bExists = false;

		head.childNodes.forEach(e => {
			if (e.nodeName === "LINK" && e.href === href) {
				bExists = true;
			}
		});

		return bExists;
	}
}