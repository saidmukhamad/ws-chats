import React from "react";
import { SockContext } from "@components/app/socketManager";
function ChatList() {
  const context = React.useContext(SockContext);

  React.useEffect(() => {
    context.actions.getChatList();
  }, []);

  return (
    <div>
      {Array.from(context.state.chats).map((chat) => (
        <div key={chat.id}>{chat.id}</div>
      ))}
    </div>
  );
}

export default ChatList;
