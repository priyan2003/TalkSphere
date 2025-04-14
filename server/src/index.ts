import express from "express";
import http from "http";
import serverConfig from "./config/server.config";
import { Server as SocketIOServer } from 'socket.io';
import { ExpressPeerServer } from "peer";
import cors from "cors";
import roomHandler from "./handler/roomHandler";

const app = express();
app.use(cors());

const server = http.createServer(app);

// Attach PeerJS to /myapp path
const peerServer = ExpressPeerServer(server, {
  path: "/myapp",
});
app.use("/myapp", peerServer);

// Setup socket.io
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

const PORT = serverConfig.PORT;

server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
