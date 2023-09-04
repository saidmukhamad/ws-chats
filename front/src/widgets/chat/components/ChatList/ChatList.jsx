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
        <div></div>
      ))}
    </div>
  );
}

export default ChatList;
