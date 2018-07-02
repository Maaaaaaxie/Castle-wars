function login() {
    const oInput = document.getElementsByTagName("input")[0];
    const sValue = oInput.value.trim();
    if (sValue) {
        sessionStorage.username = sValue;
        window.location.href = window.location.href.replace("login", "chat");
    }
}

function onInputClick(e) {
    if (e.keyCode === 13) {
        this.login();
    }
}

window.onload = () => document.getElementsByTagName("input")[0].focus();