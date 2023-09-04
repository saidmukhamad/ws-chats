import React from "react";
import io, { Socket, DefaultEventsMap } from "socket.io-client";

import { Context } from "../context/Context";
import { link } from "../../shared/api/instance";
import useDrag from "@components/shared/utils/useDrag";

const defaultContextValue = {
  state: {
    chats: new Map(),
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
  /**
   * @type {Socket<DefaultEventsMap, DefaultEventsMap>}
   */
  const socket = socketConnection.current;

  const [chatState, setChatState] = React.useState({
    chats: new Map(),
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
      /**
       * Represents a participant.
       * @typedef {Object} Participant
       * @property {string} id - The participant's id.
       * @property {string} email - The participant's email address.
       */

      /**
       * Represents data for the chat:create event.
       * @typedef {Object} ChatCreateData
       * @property {string} chatId - The chat's ID.
       * @property {Participant[]} participants - The list of users participating in the chat.
       */

      ws.on(
        "chat:create",
        /**
         * Event listener for the chat:create event.
         *
         * @param {ChatCreateData} data - The data for the chat:create event.
         */ (data) => {
          setChatState((prev) => ({
            ...prev,
            chats: [
              ...prev.chats,
              {
                ...data,
                messages: [],
              },
            ],
          }));
        }
      );

      /**
       * @typedef {Object} Message
       * @property {string} id
       * @property {string} body
       * @property {string} type
       */

      /**
       * Represents data for the chat:create event.
       * @typedef {Object} ChatMessage
       * @property {string} chatId - The chat's ID.
       * @property {Message} participants - The list of users participating in the chat.
       */

      ws.on(
        "chat:message",
        /**
         * Event listener for the chat:create event.
         *
         * @param {ChatMessage} data - The data for the chat:create event.
         */
        (data) => {}
      );
    }
  }, []);

  const createChatWS = async (id) => {
    try {
      if (socket !== null) {
        socket.emit("chat:create", id);
      }
    } catch (error) {}
  };

  const sendMessageWS = async (id, type, body) => {
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
        socket.emit("users", 0);
      }
    } catch (error) {}
  };

  const { ref } = useDrag();

  const actions = {
    getUsers: getUserListWS,
  };

  return (
    <SockContext.Provider value={{ state: chatState, actions: actions }}>
      <div ref={ref} className="panel">
        <div className="panel-item">
          <button onClick={createChatWS}>create chat</button>
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
