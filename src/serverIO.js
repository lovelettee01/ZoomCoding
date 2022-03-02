import Http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("homeIO"));

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

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsSocket;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) publicRooms.push(key);
  });
  return publicRooms;
  // const sids = wsSocket.sockets.adapter.sids;
  // const rooms = wsSocket.sockets.adapter.rooms;
}

function countRoom(roomNm) {
  return wsSocket.sockets.adapter.rooms.get(roomNm)?.size;
}

wsSocket.on("connection", (socket) => {
  socket["nickname"] = `Anonymous_${Date.now()}`;
  socket.onAny((e) => {
    console.log(`onAyn >> ${e}`);
  });

  socket.on("enterRoom", (data, done) => {
    const roomName = data.payload;
    socket.join(roomName);
    const userCount = countRoom(roomName);
    done({ isSucces: true, msg: "성공", count: userCount });
    socket.to(roomName).emit("welcome", {
      id: socket.id,
      nickname: socket.nickname,
      count: userCount,
    });

    wsSocket.sockets.emit("roomChange", publicRooms());
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", {
        id: socket.id,
        nickname: socket.nickname,
        count: countRoom(room) - 1,
      })
    );
  });

  socket.on("disconnect", () => {
    wsSocket.sockets.emit("roomChange", publicRooms());
  });

  socket.on("sendMessage", (data, room, done) => {
    const message = data.payload;
    socket.to(room).emit("newMessage", {
      id: socket.id,
      nickname: socket.nickname,
      msg: message,
    });
    done();
  });

  socket.on("saveNickname", (data, done) => {
    const nickname = data.payload;
    socket["nickname"] = nickname;
    done();
  });
});

httpServer.listen(3000, handelListen);
