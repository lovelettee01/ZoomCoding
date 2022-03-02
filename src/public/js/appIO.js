const socket = io();

const welcome = document.getElementById("welcome");
const wForm = welcome.querySelector("form");

const room = document.getElementById("room");
const nickForm = room.querySelector("#nickForm");
const msgForm = room.querySelector("#msgForm");

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
  room.querySelector(
    "h3"
  ).innerText = `Room Name is ${roomName} (${data.count})`;
  addMessage(`[${data.nickname}] Joined Room!!~`);
});

socket.on("bye", (data) => {
  room.querySelector(
    "h3"
  ).innerText = `Room Name is ${roomName} (${data.count})`;
  addMessage(`[${data.nickname}] lefted Room!!~`);
});

socket.on("roomChange", (rooms) => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerHTML = room;
    roomList.appendChild(li);
  });
});

socket.on("newMessage", (data) => {
  addMessage(`[${data.nickname}] : ${data.msg}`);
});

wForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const input = wForm.querySelector("input");
  socket.emit("enterRoom", { payload: input.value }, (result) => {
    welcome.hidden = true;
    room.hidden = false;
    room.querySelector(
      "h3"
    ).innerText = `Room Name is ${roomName} (${result.count})`;
  });
  roomName = input.value;
  input.value = "";
});

nickForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const input = nickForm.querySelector("input");
  const value = input.value;
  socket.emit("saveNickname", { payload: input.value }, () => {
    addMessage(`You Save NickName : ${value}`);
  });
  input.value = "";
});

msgForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const input = msgForm.querySelector("input");
  const value = input.value;
  socket.emit("sendMessage", { payload: input.value }, roomName, () => {
    addMessage(`You Send Message : ${value}`);
  });
  input.value = "";
});
