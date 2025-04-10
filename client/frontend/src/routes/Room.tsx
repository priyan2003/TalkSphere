import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/socketContext";
import UserFeedPlayer from "../components/UserFeedPlayer";

const Room: React.FC = () => {
    const { id } = useParams();
    const { socket, user,stream } = useContext(SocketContext);

    const fetchParticipantsList = ({roomId, participants}: {roomId:string, participants:string[]}) =>{
        console.log("Fetching participants....");
        console.log(roomId," ", participants);
    }

    useEffect(() => {
        if (user && socket) {
            console.log(user._id);
            console.log(id);
            socket.emit("joined-room", { roomId: id, peerId: user._id });
            socket.on("get-users",fetchParticipantsList)
        }
    }, [user, id, socket]);

    if (!user) {
        return <div>Loading user info...</div>;
    }

    return (
        <div>
            room: {id}
            <UserFeedPlayer stream={stream}/>
        </div>
    );
};

export default Room;
