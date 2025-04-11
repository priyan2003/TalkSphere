import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SocketContext } from "../context/socketContext";
import UserFeedPlayer from "../components/UserFeedPlayer";

const Room: React.FC = () => { 
    const { id } = useParams();
    const { socket, user, stream, peers} = useContext(SocketContext);

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
    }, [user, id, socket,peers]);

    if (!user) {
        return <div>Loading user info...</div>;
    }

    return (
        <div>
            room: {id}
            <br />
            Your own user feed
            <UserFeedPlayer stream={stream}/>
            <div>
                Others user feed
                {Object.keys(peers).map((peerId)=>(
                    <>
                       <UserFeedPlayer key={peerId} stream={peers[peerId].stream}/>
                    </>
                ))}
            </div>
        </div>
    );
};

export default Room;
