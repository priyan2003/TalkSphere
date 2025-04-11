import { Socket } from "socket.io/dist";
import {v4 as UUIDv4} from "uuid";
import IRoomParams from "../interfaces/IRoomParams";

// the below map stores for a room what all peer have joined
const rooms: Record<string,string[]> = {};

const roomHandler = (socket: Socket) => {
    const createRoom = () =>{
        console.log("creating a room...");
        const roomId = UUIDv4();// this is our unique room id in which multiple connection will exchange data
        socket.join(roomId);// we will make a socket connection to a new room
        rooms[roomId] = [];
        socket.emit("room-created", {roomId});// we will emit an event from server side that socket connection has been added to a room
        console.log(`room is created with room id ${roomId}`);  
    };

    const joinedRoom = ({ roomId, peerId} : IRoomParams) => {
        
        if(rooms[roomId]){
            console.log("New user has joined room: ", roomId,"with peerId as ",peerId);
            // this moment new user joined with peer id "peerId" at room Id as roomId
            rooms[roomId].push(peerId);
            socket.join(roomId);

            // whenever anyone joins the room
            socket.on("ready",()=>{
                // from frontend if someone joins the room we emit a "ready" event
                // then from server we emit an events to inform all connected user that a new peer user has been added
                socket.to(roomId).emit("user-joined",{peerId});
            });

            // below event is just for logging pupose
            socket.emit("get-users",{
                roomId,
                participants: rooms[roomId]
            });
         }
    };
    // we will call the above funtion when the client will emit the event to create room and join room
    socket.on("create-room",createRoom);
    socket.on("joined-room",joinedRoom); 
};
export default roomHandler;