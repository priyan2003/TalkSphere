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
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
// Attach PeerJS to /myapp path
const peerServer = (0, peer_1.ExpressPeerServer)(server, {
    path: "/myapp",
});
app.use("/myapp", peerServer);
// Setup socket.io
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
const PORT = server_config_1.default.PORT;
server.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
});
