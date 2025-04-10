import { Socket } from "socket.io/dist";
import {v4 as UUIDv4} from "uuid";
const roomHandler = (socket: Socket) => {
    const createRoom = () =>{
        console.log("creating a room...");
        const roomId = UUIDv4();// this is our unique room id in which multiple connection will exchange data
        socket.join(roomId);// we will make a socket connection to a new room
        socket.emit("room-created", {roomId});// we will emit an event from server side that socket connection has been added to a room
        console.log(`room is created with room id ${roomId}`);
        
    };

    const joinedRoom = ({ roomId } : {roomId: string}) => {
        console.log("New user has joined room", roomId);
    };
    // we will call the above funtion when the client will emit the event to create room and join room
    socket.on("create-room",createRoom);
    socket.on("joined-room",joinedRoom); 
};
export default roomHandler;