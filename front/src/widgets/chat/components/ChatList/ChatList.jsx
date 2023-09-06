import React from "react";
import { SockContext } from "@components/app/socketManager";
import { useNavigate } from "react-router-dom";
import ChatListItem from "./ChatListItem/ChatListItem";
function ChatList() {
  const context = React.useContext(SockContext);

  React.useEffect(() => {
    context.actions.getChatList();
  }, []);

  return (
    <div>
      {context.state.chats.arr().map((d) => (
        <ChatListItem d={d} setChat={context.actions.setChat} />
      ))}
    </div>
  );
}

export default ChatList;
