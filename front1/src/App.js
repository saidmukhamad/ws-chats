import logo from "./logo.svg";
import "./App.css";
import io from "socket.io-client";
import React from "react";
import { msg, msgs } from "./constants/messages";
import Chat from "./chat/Chat";
const link = "http://localhost:3000/";

function App() {
  const [ioState, setIoState] = React.useState(null);

  React.useEffect(() => {
    if (ioState == null) {
      const ws = io(link);
      console.log("ws", ws);
    }
  }, []);

  return (
    <div className="App">
      working
      <Chat />
    </div>
  );
}

export default App;
