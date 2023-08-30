import React from "react";
import { Context } from "../../app/context/Context";

function Chat() {
  const context = React.useContext(Context);

  if (!context.user.loggedIn) {
    return null;
  }

  return (
    <div
      style={{
        width: "500px",
        height: "800px",
        border: "0.5px solid black",
      }}
    >
      Chat
    </div>
  );
}

export default Chat;
