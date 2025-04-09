import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./routes/Home";
import Room from "./routes/Room";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/room/:id" element={<Room/>} />
      </Routes>
    </>
  );
}

export default App;
