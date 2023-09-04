import React from "react";
import { Context } from "@components/app/context/Context";

import ActiveChat from "./components/ActiveChat/ActiveChat";
import ChatList from "./components/ChatList/ChatList";
import NewChat from "./components/NewChat/NewChat";

import { Routes, Route } from "react-router-dom";

function Chat() {
  const context = React.useContext(Context);

  if (!context.user.loggedIn) {
    return null;
  }

  return (
    <div className="chat-container">
      <Routes>
        <Route path="/" element={<ChatList />} />
        <Route path="/chat" element={<ActiveChat />} />
        <Route path="/new" element={<NewChat />} />
        <Route />
      </Routes>
    </div>
  );
}

export default Chat;
