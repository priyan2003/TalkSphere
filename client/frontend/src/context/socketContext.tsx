import SocketIoClient from "socket.io-client"
import {createContext, useEffect, useReducer, useState} from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs"
import {v4 as UUIDv4} from "uuid";
import { peerReducer } from "../Reducers/peerReducers";
import { addPeerAction } from "../Actions/peerActions";
const ws_server = "https://talksphere-priyanshu.onrender.com";


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

    const [peers,dispatch] = useReducer(peerReducer, {});

    const fetchUsersFeed = async () => {
       const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
       setStream(stream);
    }
   
    useEffect(()=>{
        const userId = UUIDv4();
        const newPeer = new Peer(userId, {
            host: "talksphere-priyanshu.onrender.com",  // no "https://"
            secure: true,
            port: 443,  // default HTTPS port
            path: "/myapp"
        });
        
        setUser(newPeer);
        fetchUsersFeed();
        const enterRoom = ({roomId} : {roomId:string}) =>{
            navigate(`/room/${roomId}`)
        }
        // we will transer user to the room page
        socket.on("room-created",enterRoom);
    },[])

    useEffect(()=>{
        if(!user || !stream) return;

        socket.on("user-joined",({peerId})=>{
            const call = user.call(peerId,stream);
            console.log("Calling a new peer",peerId);
            call.on("stream",()=>{
                dispatch(addPeerAction(peerId,stream))
            })
        })
        user.on("call", (call) => {
            // what to do when others peers call to you when you joined
            console.log("receiving a call");
            call.answer(stream)
            call.on("stream",()=>{
                dispatch(addPeerAction(call.peer,stream))
            })
        })
        socket.emit("ready")
    },[user,stream])
    return (
        <SocketContext.Provider value = {{socket,user,stream,peers}}>
          {children}
        </SocketContext.Provider>
    )   
} 