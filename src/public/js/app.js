const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#msgForm");
const nicknameForm = document.querySelector("#nickForm");

const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  const msgObj = { type, payload };
  return JSON.stringify(msgObj);
}

socket.addEventListener("open", (data) => {
  console.log(`Connected to Server!!`);
});

socket.addEventListener("message", (msg) => {
  console.log(`Just got this : ${msg.data} from the Server!`);

  const li = document.createElement("li");
  li.innerHTML = `${msg.data}`;
  messageList.append(li);
});

socket.addEventListener("close", (data) => {
  console.log(`Disconnected from Server!!`);
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = messageForm.querySelector("input");
  socket.send(makeMessage("sendMsg", text.value));
  text.value = "";
});

nicknameForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = nicknameForm.querySelector("input");
  socket.send(makeMessage("nickName", text.value));
});

// setTimeout(() => {
//   socket.send("Hi~~ I'm client1");
// }, 3000);
