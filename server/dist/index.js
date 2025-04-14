"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const server_config_1 = __importDefault(require("./config/server.config"));
const socket_io_1 = require("socket.io");
const peer_1 = require("peer");
const cors_1 = __importDefault(require("cors"));
const roomHandler_1 = __importDefault(require("./handler/roomHandler"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // In case you want to handle JSON payloads
const server = http_1.default.createServer(app);
// --- PeerJS Setup ---
const peerServer = (0, peer_1.ExpressPeerServer)(server, {
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
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
io.on("connection", (socket) => {
    console.log(`📡 Socket connected: ${socket.id}`);
    (0, roomHandler_1.default)(socket);
    socket.on("disconnect", () => {
        console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
});
// --- Start Server ---
const PORT = server_config_1.default.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 PeerJS server available at /myapp`);
});
