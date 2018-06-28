const socket = io();

function submit(e) {
    if (e.keyCode === 13) { // Enter
        const oInput = document.getElementById('input');
        const sValue = oInput.value.trim();

        if (sValue) {
            const oMessage = {
                text: sValue,
                username: sessionStorage.username,
                date: new Date()
            };

            socket.emit('chatIn', oMessage);
        }
        oInput.value = "";
    }
}

function addItemToList(oMessage) {
    const oUl = document.getElementById("list");
    const oLi = document.createElement("li");
    const sText = oMessage.username + ": " + oMessage.text + " (" + new Date(oMessage.date).toLocaleString() + ")";
    oLi.appendChild(document.createTextNode(sText));
    oUl.appendChild(oLi);
}

socket.on('chatOut', function(message){
    addItemToList(message);
});

window.onload = () => document.getElementById('input').focus();