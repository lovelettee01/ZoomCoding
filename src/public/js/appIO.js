const socket = io();

const welcome = document.getElementById("welcome");
const wForm = welcome.querySelector("form");

const room = document.getElementById("room");
const rForm = room.querySelector("form");

let roomName = "";
window.addEventListener("load", () => {
  room.hidden = true;
});

socket.on("welcome", (data) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerHTML = `[${data.id}] Joined Room!!~`;
  ul.appendChild(li);
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
});
