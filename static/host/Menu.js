class Menu {
    constructor() {

    }

    getDialog() {
        return document.getElementById('menu');
    }

    open() {
        this.getDialog().style.display = "block";
    }

    close() {
        this.getDialog().style.display = "none";
    }

    toggle() {
        if (this.getDialog().open) {
            this.open();
        } else {
            this.close();
        }
    }

    toggleReady(b) {
        const oCenter = document.getElementById("menu").getElementsByClassName("center")[0];
        const oCenterLaunch = oCenter.getElementsByClassName("content")[0].getElementsByClassName("launch")[0];
        const oCenterShow = oCenter.getElementsByClassName("content")[0].getElementsByClassName("show")[0];
        const oCenterInfo = oCenter.getElementsByClassName("info")[0];

        const oElement1 = b ? oCenterLaunch : oCenterShow;
        const oElement2 = !b ? oCenterLaunch : oCenterShow;
        oCenterInfo.style.display = b ? "none" : "block";

        oElement2.classList.remove("animation-grow");
        oElement2.classList.add("animation-shrink");
        setTimeout(() => {
            oElement2.style.display = "none";
            oElement2.classList.remove("animation-shrink");
            oElement1.style.display = "grid";
            oElement1.classList.add("animation-grow");
        });
    }

    togglePlayer(iNumber, b) {
        const oDiv = document.getElementById("menu-player-" + iNumber);
        const oImage = oDiv.getElementsByClassName("content")[0].getElementsByClassName("image")[0];
        const oNoImage = oDiv.getElementsByClassName("content")[0].getElementsByClassName("no-image")[0];
        const oInfo = oDiv.getElementsByClassName("info")[0];

        const oImg1 = b ? oImage : oNoImage;
        const oImg2 = b ? oNoImage : oImage;

        oImg2.classList.remove("animation-grow");
        oImg2.classList.add("animation-shrink");
        setTimeout(() => {
            oImg2.style.display = "none";
            oImg2.classList.remove("animation-shrink");
            oImg1.style.display = "grid";
            oImg1.classList.add("animation-grow");
        }, 500);

        oInfo.innerText = b ? "Verbunden" : "Nicht verbunden";
    }

}