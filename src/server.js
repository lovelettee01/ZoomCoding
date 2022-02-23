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

wss.on("connection", (socket) => {
  console.log("Connected to Browser !!!");

  socket.on("close", () => {
    console.log("Disconnection from client");
  });
  socket.on("message", (message) => {
    console.log("from client Message", message.toString("utf8"));
  });
  socket.send("Hello!!!");
});

server.listen(3000, handelListen);
