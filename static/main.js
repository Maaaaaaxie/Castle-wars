const socket = io();

function submit(e) {
    if (e.keyCode === 13) { // Enter
        const input = document.getElementById('input');
        const value = input.value.trim();
        if (value) {
            socket.emit('chatIn', value);
        }
        input.value = "";
    }
}

function addItemToList(text) {
    const ul = document.getElementById("list");
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(text));
    ul.appendChild(li);
}

socket.on('chatOut', function(msg){
    addItemToList(msg);
});

window.onload = () => document.getElementById('input').focus();