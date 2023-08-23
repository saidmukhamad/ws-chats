import "./App.css";
import io from "socket.io-client";
import React from "react";
import Chat from "./widgets/chat/Chat";
import Auth from "./widgets/auth/Auth";
import { link } from "./shared/constants/url";

function App() {
  const [ioState, setIoState] = React.useState(null);

  React.useEffect(() => {
    if (ioState == null) {
      const ws = io(link, {
        withCredentials: true,
      });
      console.log("ws", ws);
      ws.emit("chat-message", "message");

      ws.on("user-data", (data) => console.log(data));
      setIoState(ws);
    }
  }, []);

  const send = () => {
    if (ioState !== null) {
      ioState.emit("message", "123");
    }
  };
  return (
    <div className="App">
      <Auth />
      <Chat />
    </div>
  );
}

export default App;
