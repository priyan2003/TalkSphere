import express from "express";
import http from "http";
import cors from "cors";
import { ExpressPeerServer } from "peer";
import { Server as SocketIOServer } from "socket.io";
import serverConfig from "./config/server.config";
import roomHandler from "./handler/roomHandler";

const app = express();
app.use(cors());

const server = http.createServer(app);

// ✅ Setup Peer Server on /peerjs path
const peerServer = ExpressPeerServer(server, {
//   debug: true,
  path: "/",
});

// ✅ Attach it like this
app.use("/peerjs", peerServer);

// ✅ Setup Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("New user connected");
  roomHandler(socket);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ✅ Listen
const PORT = serverConfig.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
