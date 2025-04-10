import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom"
import { SocketContext } from "../context/socketContext";

const Room: React.FC = () => {
    const {id} = useParams();
    const {socket} = useContext(SocketContext);
    useEffect(()=>{
        socket.emit("joined-room",{roomId:id});
    },[])
    return (
        <div>
            Room with {id}
        </div>
    )
}
export default Room