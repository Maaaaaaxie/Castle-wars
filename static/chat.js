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
    const oTextDiv = document.createElement("div");
    oTextDiv.className = "text";
    const oDateDiv = document.createElement("div");
    oDateDiv.className = "date";
    const sText = oMessage.username + ": " + oMessage.text;
    const sDate = new Date(oMessage.date).toLocaleTimeString();
    oTextDiv.appendChild(document.createTextNode(sText));
    oDateDiv.appendChild(document.createTextNode(sDate));
    oLi.appendChild(oTextDiv);
    oLi.appendChild(oDateDiv);
    oUl.appendChild(oLi);
}

socket.on('chatOut', function(message){
    addItemToList(message);
});

window.onload = () => document.getElementById('input').focus();