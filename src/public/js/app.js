const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", (data) => {
  console.log(`Connected to Server!!`);
});

socket.addEventListener("message", (msg) => {
  console.log(`Just got this : ${msg.data} from the Server!`);
});

socket.addEventListener("close", (data) => {
  console.log(`Disconnected from Server!!`);
});

setTimeout(() => {
  socket.send("Hi~~ I'm client1");
}, 3000);
