import React from "react";
import { SockContext } from "@components/app/socketManager";
import { useNavigate } from "react-router-dom";
function ChatList() {
  const context = React.useContext(SockContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    context.actions.getChatList();
  }, []);

  return (
    <div>
      {context.state.chats.arr().map((d) => {
        console.log(d);
        const data = d[1];
        return (
          <div key={d[0]} className="row-flex">
            <div className="row-flex" style={{ justifyContent: "start" }}>
              {data.users.map((u) => (
                <p>{u}</p>
              ))}
            </div>
            <button
              onClick={() => {
                context.actions.setChat(d[0]);
                navigate(`/chat/${d[0]}`);
              }}
            >
              перейти
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ChatList;
