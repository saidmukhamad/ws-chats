import React from "react";
import { Context } from "@components/app/context/Context";

import ActiveChat from "./components/ActiveChat/ActiveChat";
import ChatList from "./components/ChatList/ChatList";
import NewChat from "./components/NewChat/NewChat";

import { Routes, Route, useNavigate } from "react-router-dom";

function Chat() {
  const context = React.useContext(Context);
  const navigate = useNavigate();

  if (!context.user.loggedIn) {
    return null;
  }

  return (
    <div className="chat-container">
      <nav>
        <button onClick={() => navigate("/")}>chat list</button>
        <button onClick={() => navigate("/new")}>new</button>
      </nav>
      <Routes>
        <Route path="/" element={<ChatList />} />
        <Route path="/chat/:id" element={<ActiveChat />} />
        <Route path="/new" element={<NewChat />} />
        <Route />
      </Routes>
    </div>
  );
}

export default Chat;
