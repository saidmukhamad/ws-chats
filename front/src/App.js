import "./App.css";
import "./index.css";
import React from "react";
import Chat from "./widgets/chat/Chat";
import Auth from "./widgets/auth/Auth";

function App() {
  return (
    <div className="App">
      <Auth />
      <Chat />
    </div>
  );
}

export default App;
