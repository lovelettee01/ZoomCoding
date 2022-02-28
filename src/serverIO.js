import express from "express";
import Http from "http";
import { Server } from "socket.io";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("homeIO"));

const handelListen = () => console.log(`Listening on Http://localhost:3000`);
//app.listen(3000, handelListen);

const httpServer = Http.createServer(app);
const wsSocket = new Server(httpServer);

wsSocket.on("connection", (socket) => {
  socket.on("enterRoom", (data, done) => {
    const roomName = data.payload;
    socket.onAny((e) => {
      console.log(`onAyn >> ${e}`);
    });
    socket.join(roomName);
    done({ isSucces: true, msg: "성공" });
    socket.to(roomName).emit("welcome", { id: socket.id });
  });
});

httpServer.listen(3000, handelListen);
