import React from "react";
import io, { Socket, DefaultEventsMap } from "socket.io-client";

import { ChatStore } from "@components/shared/utils/chatStore/chatStore";
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
    getUsers: (page) => 1,
    createChat: (id) => 1,
    getChatList: (page) => 1,
    sendMessage: (id, type, body) => 1,
    readMessages: (id) => 1,
    setChat: (id) => 1,
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
    chats: new ChatStore(),
    activeChat: {
      loading: false,
      chat: {
        id: null,
        messages: [],
      },
    },
    userList: [],
  });

  const [actionsList, setActionsList] = React.useState([]);

  React.useEffect(() => {
    setState({
      loggedIn: userContext.user.loggedIn,
      email: userContext.user.email,
    });
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

      ws.on("chat:list", (data) => {
        setChatState((prev) => {
          let tempStore = new ChatStore(prev.chats);
          tempStore.populateFromData(data);
          return { ...prev, chats: tempStore };
        });
      });

      ws.on("chat:look", (data) => {
        console.log(data, "chatLLOOOK");
        setChatState((prev) => ({
          ...prev,
          activeChat: {
            loading: false,
            chat: data,
          },
        }));
      });

      ws.on("trigger", () => {
        console.log(chatState, "chatState to checlasdkjk");
        setActionsList((prev) => [...prev, "triggered from node"]);
      });

      ws.on("chat:read", ({ id }) => {
        setChatState((prev) => {
          if (prev.activeChat.chat.id == id) {
            return {
              ...prev,
              activeChat: {
                ...prev.activeChat,
                chat: {
                  ...prev.activeChat.chat,
                  messages: prev.activeChat.chat.messages.map((m) => ({
                    ...m,
                    read: { ...m.read, read: true },
                  })),
                },
              },
            };
          }
        });
        if (chatState.activeChat.chat.id === id) {
          set;
        }
      });

      ws.on("chat:message", (data) => {
        setChatState((prev) => {
          if (prev.activeChat.chat.id == data.chatId) {
            return {
              ...prev,
              activeChat: {
                ...prev.activeChat,
                chat: {
                  ...prev.activeChat.chat,
                  messages: [...prev.activeChat.chat.messages, data],
                },
              },
            };
          } else {
            // prev.chats.
            return { ...prev };
          }
        });
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
          setChatState((prev) => {
            let tempStore = new ChatStore(prev.chats);
            tempStore.populateFromData(data);
            return { ...prev, chats: tempStore };
          });
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
    }
  }, [userContext.user]);

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
        socket.emit("chat:sendMessage", {
          id: id,
          body,
        });
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

  const getChatListWS = async (page = 0) => {
    try {
      socket.emit("chat:list", page);
    } catch (e) {
      console.log(e);
    }
  };

  const readMessagesWs = (id) => {
    if (socket !== null) {
      socket.emit("chat:read", id);
    }
  };

  const trigger = () => {
    try {
      if (socket) {
        socket.emit("trigger");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const setActiveChat = async (id) => {
    if (socket) {
      setChatState((prev) => ({
        ...prev,
        activeChat: {
          chat: {
            id: null,
            messages: [],
            name: null,
          },
          loading: true,
        },
      }));
      socket.emit("chat:look", id);
    }
  };

  const { ref } = useDrag();

  const actions = {
    getUsers: getUserListWS,
    createChat: createChatWS,
    getChatList: getChatListWS,
    setChat: setActiveChat,
    sendMessage: sendMessageWS,
    readMessages: readMessagesWs,
  };

  return (
    <SockContext.Provider
      value={{ state: { ...chatState, email: state.email }, actions: actions }}
    >
      <div ref={ref} className="panel">
        <div className="panel-item">
          <button onClick={createChatWS}>create chat</button>
          <button onClick={sendMessageWS}>write in chat</button>
          <button onClick={getUserListWS}>getUserListWS</button>
          <button onClick={trigger}>trigger</button>
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
