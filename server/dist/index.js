"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const peer_1 = require("peer");
const socket_io_1 = require("socket.io");
const server_config_1 = __importDefault(require("./config/server.config"));
const roomHandler_1 = __importDefault(require("./handler/roomHandler"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
// ✅ Setup Peer Server on /peerjs path
const peerServer = (0, peer_1.ExpressPeerServer)(server, {
    //   debug: true,
    path: "/",
});
// ✅ Attach it like this
app.use("/peerjs", peerServer);
// ✅ Setup Socket.IO
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
io.on("connection", (socket) => {
    console.log("New user connected");
    (0, roomHandler_1.default)(socket);
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});
// ✅ Listen
const PORT = server_config_1.default.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
