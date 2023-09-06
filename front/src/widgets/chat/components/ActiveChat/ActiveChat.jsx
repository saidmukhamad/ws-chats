import { SockContext } from "@components/app/socketManager";
import { useParams } from "react-router-dom";
import React from "react";
import InputMessage from "./components/InputMessage/InputMessage";
function ActiveChat() {
  const context = React.useContext(SockContext);

  const [input, setInput] = React.useState("");
  const params = useParams();

  React.useEffect(() => {
    if (!(context.state.activeChat.chat.id === params.id)) {
      context.actions.setChat(params.id);
    } else {
      context.actions.readMessages(context.state.activeChat.chat.id);
    }
  }, [context.state.activeChat]);

  return (
    <div>
      {context.state.activeChat.chat.messages.map((m) => (
        <InputMessage message={m} email={context.state.email} />
      ))}

      <div>
        Write message
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={() => {
            console.log(context.state.activeChat.chat);
            context.actions.sendMessage(
              context.state.activeChat.chat.id,
              "text",
              input
            );
            setInput("");
          }}
        >
          send message
        </button>
      </div>
    </div>
  );
}

export default ActiveChat;
