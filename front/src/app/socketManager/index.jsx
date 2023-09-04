import React from "react";
import io from "socket.io-client";

import { Context } from "../context/Context";
import { link } from "../../shared/api/instance";
import useDrag from "@components/shared/utils/useDrag";
const defaultContextValue = {
  state: {
    chats: [],
    activeChat: {},
    userList: [],
  },
  actions: {
    getUsers: () => 1,
  },
};

export const SockContext = React.createContext(defaultContextValue);

/**
 * @description Context for socket and chat state management, laziness gone up, would not split
 * @returns
 */

function SockProvider({ children }) {
  const userContext = React.useContext(Context);

  const [state, setState] = React.useState({
    loggedIn: userContext.user.loggedIn,
    email: userContext.user.email,
  });

  const socketConnection = React.useRef(null);
  const socket = socketConnection.current;
  const [chatState, setChatState] = React.useState({
    chats: [],
    activeChat: {},
    userList: [],
  });

  const [actionsList, setActionsList] = React.useState([]);

  React.useEffect(() => {
    if (socket === null) {
      const ws = io(link, {
        withCredentials: true,
      });

      socketConnection.current = ws;
      ws.on("users", (data) => {
        setChatState((prev) => ({
          ...prev,
          userList: data,
        }));

        setActionsList((prev) => [...prev, "users came [sock]"]);
      });
    }
  }, []);

  const createChatWS = async (id) => {
    try {
    } catch (error) {}
  };

  const connect = () => {
    try {
    } catch (error) {}
  };

  const sendMessageWS = async () => {
    try {
      if (socket !== null) {
      }
    } catch (error) {}
  };

  const loadMessagesWS = async () => {
    try {
    } catch (error) {}
  };

  const getUserListWS = async () => {
    try {
      if (socket !== null) {
        const test = socket.emit("users", 0);
      }
    } catch (error) {}
  };

  const { ref } = useDrag();

  const actions = {
    getUsers: getUserListWS,
  };

  return (
    <SockContext.Provider value={{ state: chatState, actions: actions }}>
      <div
        ref={ref}
        // style={{ left: `${position.x}px`, top: `${position.y}px` }}
        className="panel"
      >
        <div className="panel-item">
          <button onClick={createChatWS}>create chat</button>
          <button onClick={connect}>connect</button>
          <button onClick={sendMessageWS}>write in chat</button>
          <button onClick={getUserListWS}>getUserListWS</button>
        </div>
        <div className="panel-item panel-item-log">
          <p>actions log</p>
          <div>
            {actionsList.map((act, idx) => (
              <p key={idx}>{act}</p>
            ))}
          </div>
        </div>
      </div>
      {children}
    </SockContext.Provider>
  );
}

export default SockProvider;
