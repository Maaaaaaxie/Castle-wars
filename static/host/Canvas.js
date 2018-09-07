class Canvas {
    static _getCtx() {
        const c = document.getElementById("canvas");
        return c.getContext("2d");
    }

    static _drawSky() {
        const iFloor = window.innerHeight - Math.round(window.innerHeight / 5);
        window._iFloor = iFloor;
        const ctx = this._getCtx();
        ctx.fillStyle = "#85d6d7";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        ctx.beginPath();
        ctx.fillStyle = "#bcf3f3";
        ctx.ellipse(window.innerWidth / 2, window._iFloor, window.innerWidth/1.4, 250, 0, Math.PI, 2 * Math.PI);
        ctx.filter = "blur(105px)";
        ctx.fill();
        ctx.filter = "none";
    }

    static _drawSea() {
        const ctx = this._getCtx();
        ctx.fillStyle = "#5293c5";
        ctx.fillRect(0, window.innerHeight / 1.7, window.innerWidth, window.innerHeight);
    }

    static _drawHills() {
        const ctx = this._getCtx();
        const sLight = "#7fcccd";
        const sMid = "#74babb";
        const sDark = "#68a7a8";

        let x = window.innerWidth;
        let y = window._iFloor;

        ctx.beginPath();
        ctx.fillStyle = sLight;
        ctx.moveTo(-200, y);
        ctx.bezierCurveTo(0, window.innerHeight / 4, x / 3, window.innerHeight / 2, x / 1.4, y);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = sMid;
        ctx.moveTo(x / 1.8, y);
        ctx.bezierCurveTo(x / 1.3, window.innerHeight / 3, x + 200, window.innerHeight / 1.8, x + 400, y);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = sDark;
        ctx.moveTo(0, y);
        ctx.bezierCurveTo(x / 4, window.innerHeight / 2, x / 2.5, window.innerHeight / 2.2, x / 1.2, y);
        ctx.fill();
    }

    static _drawShip(o) {
        const ctx = this._getCtx();
        const x = o.x;
        const y = o.y;

        ctx.fillStyle = "#734d2d";
        ctx.fillRect(x, y, 40, 4);
        ctx.fillRect(x + 1, y + 4, 38, 1);
        ctx.fillRect(x + 2, y + 5, 36, 1);
        ctx.fillRect(x + 3, y + 6, 34, 1);
        ctx.fillRect(x + 4, y + 7, 32, 1);
        ctx.fillRect(x + 5, y + 8, 30, 1);

        ctx.fillRect(x + 19, y - 26, 2, 26);

        ctx.beginPath();
        ctx.fillStyle = "#FFF";
        ctx.moveTo(x + 2, y - 20);
        ctx.bezierCurveTo(x + 2, y - 20, x + 33, y - 20, x + 33, y - 20);
        ctx.bezierCurveTo(x + 36, y - 20, x + 40, y - 2, x + 33, y - 4);
        ctx.fill();
    }

    static _drawGrass() {
        const ctx = this._getCtx();
        const iFloor = window._iFloor;

        const iHeight = window.innerHeight - iFloor;

        // grass
        ctx.fillStyle = "#4ed749";
        ctx.fillRect(0, iFloor, window.innerWidth, iHeight);

        ctx.fillStyle = "#40af3b";
        ctx.fillRect(0, iFloor, window.innerWidth, 2);
    }

    static _drawCastle(x, y, oCastleDef) {
        const ctx = this._getCtx();
        const iHeight = oCastleDef.height;
        const sColor = oCastleDef.color || "#b29759";

        const fnDarkenColor = function (sColor, iAmt) {
            const num = parseInt(sColor.replace("#", ""), 16);
            const r = (num >> 16) + iAmt;
            const b = ((num >> 8) & 0x00FF) + iAmt;
            const g = (num & 0x0000FF) + iAmt;
            const sNewColor = g | (b << 8) | (r << 16);
            return sNewColor.toString(16);
        };

        // base
        ctx.fillStyle = sColor;
        ctx.fillRect(x - 50, y - iHeight, 100, iHeight + 45);
        ctx.fillRect(x - 40, y - 10 - iHeight, 16, 10);
        ctx.fillRect(x - 9, y - 10 - iHeight, 16, 10);
        ctx.fillRect(x + 22, y - 10 - iHeight, 16, 10);

        ctx.fillStyle = "#63472e";
        const sDoorHeight = iHeight < 70 ? iHeight - 10 : 60;

        ctx.fillRect(x - 20, y - sDoorHeight, 40, sDoorHeight);

        // --- towers -----------
        ctx.fillStyle = "#" + fnDarkenColor(sColor, -35);

        // tower left
        ctx.fillRect(x - 62, y - 25 - iHeight, 24, iHeight + 70);
        ctx.fillRect(x - 66, y - 32 - iHeight, 8, 15);
        ctx.fillRect(x - 54, y - 32 - iHeight, 8, 15);
        ctx.fillRect(x - 42, y - 32 - iHeight, 8, 15);

        // tower right
        ctx.fillRect(x + 38, y - 25 - iHeight, 24, iHeight + 70);
        ctx.fillRect(x + 34, y - 32 - iHeight, 8, 15);
        ctx.fillRect(x + 46, y - 32 - iHeight, 8, 15);
        ctx.fillRect(x + 58, y - 32 - iHeight, 8, 15);

        oCastleDef.top = y - 32 - iHeight;
        oCastleDef.left = x - 66;
    }

    static _drawFence(x, y, oCastleDef) {
        const ctx = this._getCtx();
        const iHeight = oCastleDef.fence.height;
        const sColor = oCastleDef.color || "#b29759";

        const fnDarkenColor = function (sColor, iAmt) {
            const num = parseInt(sColor.replace("#", ""), 16);
            const r = (num >> 16) + iAmt;
            const b = ((num >> 8) & 0x00FF) + iAmt;
            const g = (num & 0x0000FF) + iAmt;
            const sNewColor = g | (b << 8) | (r << 16);
            return sNewColor.toString(16);
        };

        ctx.fillStyle = sColor;
        ctx.fillRect(x - 5, y - iHeight, 10, iHeight + 45);

        ctx.fillStyle = "#" + fnDarkenColor(sColor, -30);
        ctx.fillRect(x - 5, y - iHeight, 10, 10);

        oCastleDef.fence.top = y - iHeight;
        oCastleDef.fence.left = x - 5;
    }

    static _drawCloud(x, y, size, color) {
        const ctx = this._getCtx();

        ctx.beginPath();
        ctx.moveTo(x, y);

        ctx.bezierCurveTo(x - (10 * size), y, x - (10 * size), y - (10 * size), x, y - (8 * size));
        ctx.bezierCurveTo(x + (2 * size), y - (15 * size), x + (8 * size), y - (14 * size), x + (10 * size), y - (8 * size));
        ctx.bezierCurveTo(x + (20 * size), y - (10 * size), x + (20 * size), y, x + (10 * size), y);
        ctx.bezierCurveTo(x, y, x, y, x, y);

        ctx.fillStyle = color;
        ctx.fill();
    }

    static _drawDeadBird(x, y) {
        const ctx = this._getCtx();
        ctx.fillStyle = "#464954";

        // body
        ctx.fillRect(x, y, 10, 6);
        ctx.fillRect(x - 4, y, 4, 4);
        ctx.fillRect(x - 8, y, 4, 2);

        // head
        ctx.fillRect(x + 6, y - 4, 6, 4);
        ctx.fillStyle = "#FFF";
        ctx.fillRect(x + 9, y - 2, 2, 2);
        ctx.fillStyle = "#000";
        ctx.fillRect(x + 10, y - 1, 1, 1);
        ctx.fillStyle = "#cb8d1e";
        ctx.fillRect(x + 10, y, 4, 3);
    }

    static _drawBird(x, y, id) {
        if (window._oPlayer1) {
            const
                top1 = _oPlayer1.castleDef.top,
                top3 = _oPlayer1.castleDef.fence.top,
                left1 = _oPlayer1.castleDef.left,
                left3 = _oPlayer1.castleDef.fence.left;

            if (y >= top1 && x >= left1 - 5 && x <= left1 + 132) {
                _spawnDeadBird(id);
                _deleteBird(id);
            }

            if (y >= top3 && x >= left3 - 8 && x <= left3 + 10) {
                _spawnDeadBird(id);
                _deleteBird(id);
            }
        }

        if (window._oPlayer2) {
            const
                top2 = _oPlayer2.castleDef.top,
                top4 = _oPlayer2.castleDef.fence.top,
                left2 = _oPlayer2.castleDef.left,
                left4 = _oPlayer2.castleDef.fence.left;

            if (y >= top2 && x >= left2 - 5 && x <= left2 + 132) {
                _spawnDeadBird(id);
                _deleteBird(id);
            }

            if (y >= top4 && x >= left4 - 8 && x <= left4 + 10) {
                _spawnDeadBird(id);
                _deleteBird(id);
            }
        }

        const ctx = this._getCtx();
        ctx.fillStyle = "#464954";

        // body
        ctx.fillRect(x, y, 10, 6);
        ctx.fillRect(x - 4, y, 4, 4);
        ctx.fillRect(x - 8, y, 4, 2);

        // head
        ctx.fillRect(x + 6, y - 4, 6, 4);
        ctx.fillStyle = "#FFF";
        ctx.fillRect(x + 9, y - 2, 2, 2);
        ctx.fillStyle = "#000";
        ctx.fillRect(x + 10, y - 1, 1, 1);
        ctx.fillStyle = "#cb8d1e";
        ctx.fillRect(x + 10, y, 4, 3);
    }

    static _drawActiveClouds() {
        window._aActiveClouds.forEach(oCloud => {
            Canvas._drawCloud(oCloud.x, oCloud.y, oCloud.size, oCloud.color);
        });
    }

    static _drawActiveBirds() {
        window._aActiveBirds.forEach(oBird => {
            Canvas._drawBird(oBird.x, oBird.y, oBird.id);
        });
    }

    static _drawDeadBirds() {
        if (window._aDeadBirds) {
            window._aDeadBirds.forEach(oBird => {
                Canvas._drawDeadBird(oBird.x, oBird.y);
            });
        }
    }

    static _drawCanvas() {
        this._drawSky();
        this._drawSea();
        this._drawShip(window._oShip);
        this._drawHills();
        if (window._oPlayer1) {
            this._drawCastle(Math.round(window.innerWidth * 0.2), window._iFloor, window._oPlayer1.castleDef);
            this._drawFence(Math.round(window.innerWidth * 0.35), window._iFloor, window._oPlayer1.castleDef);
        }
        if (window._oPlayer2) {
            this._drawCastle(Math.round(window.innerWidth * 0.8), window._iFloor, window._oPlayer2.castleDef);
            this._drawFence(Math.round(window.innerWidth * 0.65), window._iFloor, window._oPlayer2.castleDef);
        }
        this._drawGrass();
        this._drawActiveClouds();
        this._drawActiveBirds();
        this._drawDeadBirds();
    }
}