import SocketIoClient from "socket.io-client"
import {createContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs"
import {v4 as UUIDv4} from "uuid";
const ws_server = "http://localhost:4000";

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext<any | null>(null);

const socket = SocketIoClient(ws_server,{
    withCredentials: false,
    transports: ["polling", "websocket"]
});

interface Props{
    children: React.ReactNode
}
export const SocketProvider: React.FC<Props> = ({children}) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<Peer>(); // New peer user
    const [stream, setStream] = useState<MediaStream>();

    const fetchUsersFeed = async () => {
       const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
       setStream(stream);
    }
   
    useEffect(()=>{
        const userId = UUIDv4();
        const newPeer = new Peer(userId);
        setUser(newPeer);
        fetchUsersFeed();
        const enterRoom = ({roomId} : {roomId:string}) =>{
            navigate(`/room/${roomId}`)
        }
        // we will transer user to the room page
        socket.on("room-created",enterRoom);
    },[])
    return (
        <SocketContext.Provider value = {{socket,user,stream}}>
          {children}
        </SocketContext.Provider>
    )   
} 