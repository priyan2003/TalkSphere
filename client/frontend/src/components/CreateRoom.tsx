import { useContext } from "react"
import { SocketContext } from "../context/socketContext"

const CreateRoom: React.FC = () =>{ 
    const { socket} = useContext(SocketContext);
    const roominit = () => {
        console.log("initialising the req to create a room ", socket);
        socket.emit("create-room")
    }
    return (
        <button onClick={roominit} className="btn btn-secondary">
            Create a New Meeting
        </button>
    )
}
export default CreateRoom