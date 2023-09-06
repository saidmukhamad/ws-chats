import React from "react";
import { useNavigate } from "react-router-dom";
function ChatListItem({ d, setChat }) {
  const navigate = useNavigate();
  const data = d[1];

  return (
    <div key={d[0]} className="row-flex">
      <div
        className="row-flex"
        style={{ justifyContent: "space-between", border: "1px solid black" }}
      >
        <div className="row-flex" style={{ justifyContent: "start" }}>
          {data.users.map((u) => (
            <p>{u}</p>
          ))}
        </div>
        <p>{data.messages.message ?? ""}</p>
      </div>
      <button
        onClick={() => {
          setChat(d[0]);
          navigate(`/chat/${d[0]}`);
        }}
      >
        look
      </button>
    </div>
  );
}

export default ChatListItem;
