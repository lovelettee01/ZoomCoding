const socket = io();

const welcome = document.getElementById("welcome");
const wForm = welcome.querySelector("form");

const room = document.getElementById("room");
const rForm = room.querySelector("form");

let roomName = "";
window.addEventListener("load", () => {
  room.hidden = true;
});

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerHTML = message;
  ul.appendChild(li);
}

socket.on("welcome", (data) => {
  addMessage(`[${data.id}] Joined Room!!~`);
});

socket.on("bye", (data) => {
  addMessage(`[${data.id}] lefted Room!!~`);
});

socket.on("newMessage", (data) => {
  addMessage(`[${data.id}] : ${data.msg}`);
});

wForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = wForm.querySelector("input");
  socket.emit("enterRoom", { payload: input.value }, (result) => {
    welcome.hidden = true;
    room.hidden = false;
    room.querySelector("h3").innerText = `Room Name is ${roomName}`;
  });
  roomName = input.value;
  input.value = "";
});

rForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const input = rForm.querySelector("input");
  const value = input.value;
  socket.emit("sendMessage", { payload: input.value }, roomName, () => {
    addMessage(`You Send Message : ${value}`);
  });
  input.value = "";
});
