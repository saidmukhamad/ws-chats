import "./App.css";
import io from "socket.io-client";
import React from "react";
import Chat from "./widgets/chat/Chat";
import Auth from "./widgets/auth/Auth";
import { link } from "./shared/api/url";

function App() {
  const [ioState, setIoState] = React.useState(null);

  React.useEffect(() => {
    if (ioState == null) {
      const ws = io(link, {
        withCredentials: true,
      });
      ws.emit("chat-message", "message");

      ws.on("user-data", (data) => console.log(data));
      setIoState(ws);
    }
  }, []);

  return (
    <div className="App">
      <Auth />
      <Chat />
    </div>
  );
}

export default App;
