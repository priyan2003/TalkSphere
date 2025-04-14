import express from "express";
import http from "http";
import serverConfig from "./config/server.config";
import { Server as SocketIOServer } from "socket.io";
import { ExpressPeerServer } from "peer";
import cors from "cors";
import roomHandler from "./handler/roomHandler";

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // In case you want to handle JSON payloads

const server = http.createServer(app);

// --- PeerJS Setup ---
const peerServer = ExpressPeerServer(server, {
  path: "/myapp",
//   debug: true, // Enable logs for connection lifecycle
});

peerServer.on("connection", (client) => {
  console.log(`🔌 Peer connected: ${client.getId()}`);
});

peerServer.on("disconnect", (client) => {
  console.log(`❌ Peer disconnected: ${client.getId()}`);
});

app.use("/myapp", peerServer);

// --- Socket.IO Setup ---
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log(`📡 Socket connected: ${socket.id}`);
  roomHandler(socket);

  socket.on("disconnect", () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// --- Start Server ---
const PORT = serverConfig.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 PeerJS server available at /myapp`);
});
