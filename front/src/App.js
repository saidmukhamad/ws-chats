import logo from "./logo.svg";
import "./App.css";
import io from "socket.io-client";
import React from "react";
import { msg, msgs } from "./constants/messages";
import Chat from "./chat/Chat";
const link = "http://localhost:3001/";

function App() {
  const [ioState, setIoState] = React.useState(null);

  React.useEffect(() => {
    if (ioState == null) {
      const req = fetch(`${link}cookie`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        credentials: "include",
      });
      req.then((d) => {
        const ws = io(link, {
          withCredentials: true,
        });
        console.log("ws", ws);
        ws.emit("chat-message", "message");

        ws.on("user-data", (data) => console.log(data));
        setIoState(ws);
      });
    }
  }, []);

  const send = () => {
    if (ioState !== null) {
      ioState.emit("m/:id", "123");
    }
  };
  return (
    <div className="App">
      working
      <button onClick={send}>emit</button>
      <Chat />
    </div>
  );
}

export default App;
