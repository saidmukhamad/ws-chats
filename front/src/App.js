import "./App.css";
import "./index.css";
import io from "socket.io-client";
import React from "react";
import Chat from "./widgets/chat/Chat";
import Auth from "./widgets/auth/Auth";
import { link } from "./shared/api/url";

function App() {
  const [ioState, setIoState] = React.useState(null);

  return (
    <div className="App">
      <Auth />
      <Chat />
    </div>
  );
}

export default App;
