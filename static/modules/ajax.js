export default class AJAX {
	constructor(sUrl, sMethod = "GET", bJSON = true) {
		return new Promise((fnResolve, fnReject) => {
			this._xhr = new XMLHttpRequest();
			this._xhr.open(sMethod, sUrl);
			this._xhr.onload = () => {
				if (this._xhr.status === 200) {
					fnResolve(bJSON ? JSON.parse(this._xhr.responseText) : this._xhr.responseText);
				} else {
					fnReject(this._xhr.status);
				}
			};
			this._xhr.send();
		});
	}
	static getCards() {
		return new this("/cards");
	}
}