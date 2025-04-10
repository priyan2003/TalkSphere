import SocketIoClient from "socket.io-client"
import {createContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
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
    useEffect(()=>{
        const enterRoom = ({roomId} : {roomId:string}) =>{
            navigate(`/room/${roomId}`)
        }
        // we will transer user to the room page
        socket.on("room-created",enterRoom);
    },[])
    return (
        <SocketContext.Provider value = {{socket}}>
          {children}
        </SocketContext.Provider>
    )   
} 