import Http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("homeZoom"));

const handelListen = () => console.log(`Listening on Http://localhost:3000`);
//app.listen(3000, handelListen);

//localhost:3000/admin
const httpServer = Http.createServer(app);
const wsSocket = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(wsSocket, {
  auth: false,
});

function countRoom(roomNm) {
  return wsSocket.sockets.adapter.rooms.get(roomNm)?.size;
}

wsSocket.on("connection", (socket) => {
  socket["nickname"] = `Anonymous_${Date.now()}`;
  socket.on("enterRoom", (data, done) => {
    const roomName = data.payload;
    socket.join(roomName);
    const userCount = countRoom(roomName);
    done({ result: true, message: "성공", count: userCount });
    socket.to(roomName).emit("welcome", {
      id: socket.id,
      nickname: socket.nickname,
      count: userCount,
    });
  });
});

httpServer.listen(3000, handelListen);
