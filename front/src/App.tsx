import "./App.css";
import React from "react";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client/debug";
import { DefaultEventsMap } from "@socket.io/component-emitter";
const url = "http://localhost:3000/";
function App() {
  const [state, setState] = React.useState<null | Socket<
    DefaultEventsMap,
    DefaultEventsMap
  >>(null);

  React.useEffect(() => {
    if (!state) {
      const sock = io(url);
      console.log(sock);
      // @ts-ignore
      setState(sock);
    }
  }, []);

  const msg = () => {
    if (state) {
      state.emit("chat-message", "penis");
    }
  };

  React.useEffect(() => {
    if (state) {
      state.emit("chat-message", "penis");
    }
  }, [state]);

  return (
    <>
      <h2>Chat listen</h2>
      <button onClick={msg}>meme</button>
    </>
  );
}

export default App;
