const socket = io();

function submit(e) {
    if (e.keyCode === 13) { // Enter
        const input = document.getElementById('input');
        const value = input.value.trim();

        if (value) {
            const message = {
                text: value,
                username: "Testuser",
                date: new Date()
            };

            socket.emit('chatIn', message);
        }
        input.value = "";
    }
}

function addItemToList(message) {
    const ul = document.getElementById("list");
    const li = document.createElement("li");
    const text = message.username + ": " + message.text + " (" + new Date(message.date).toLocaleString() + ")";
    li.appendChild(document.createTextNode(text));
    ul.appendChild(li);
}

socket.on('chatOut', function(message){
    addItemToList(message);
});

window.onload = () => document.getElementById('input').focus();