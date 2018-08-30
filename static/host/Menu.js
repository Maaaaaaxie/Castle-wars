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

    kick() {

    }
}