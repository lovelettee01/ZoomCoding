import express from "express";
import WebSocket from "ws";
import Http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));

const handelListen = () => console.log(`Listening on Http://localhost:3000`);
//app.listen(3000, handelListen);

const server = Http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];
let nickName = "";
wss.on("connection", (socket) => {
  sockets.push(socket);
  console.log("Connected to Browser !!!");

  socket.on("close", () => {
    console.log("Disconnection from client");
  });
  socket.on("message", (message) => {
    const msgObj = JSON.parse(message.toString("utf8"));
    console.log("from client Message", msgObj);
    switch (msgObj.type) {
      case "sendMsg":
        sockets.forEach((accSocket) => {
          accSocket.send(`[${socket.nickName}] 😀${msgObj.payload}`);
        });
        break;
      case "nickName":
        socket["nickName"] = msgObj.payload;
        break;
    }
  });
  socket.send("Hello!!!");
});

server.listen(3000, handelListen);
