import express from "express";
import http from "http";
import serverConfig from "./config/server.config";
import {Server} from 'socket.io';
import cors from "cors";


const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server( server,{
        cors:{
            origin: "*",
            methods: ["GET", "POST"]  
        }

    }
); 
io.on("connection",(socket) => {
    console.log("New user connected");

    socket.on("disconnect",()=>{
        console.log("User disconnected");
         
    });
});
const PORT = serverConfig.PORT;
server.listen(PORT, () => {
    console.log(`Server is up at port ${PORT}`); 
});  