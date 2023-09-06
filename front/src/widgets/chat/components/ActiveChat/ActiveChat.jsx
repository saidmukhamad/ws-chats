import { SockContext } from "@components/app/socketManager";
import React from "react";

function ActiveChat() {
  const context = React.useContext(SockContext);
  const [input, setInput] = React.useState("");

  return (
    <div>
      {context.state.activeChat.chat.messages.map((m) => (
        <p>{m.body}</p>
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
