import React from "react";
import { instance } from "../../shared/api/instance";
import { Context } from "../context/Context";
import io from "socket.io-client";
import Auth from "@components/widgets/auth/Auth";

const defaultContextValue = {
  user: {
    loggedIn: false,
    email: "",
  },
};

export const SockContext = React.createContext(defaultContextValue);

/**
 * @description Context for user data
 * @returns
 */

function SockProvider({ children }) {
  const userContext = React.useContext(Context);
  const [state, setState] = React.useState({
    loggedIn: userContext.user.loggedIn,
    email: userContext.user.email,
  });

  const socket = React.useRef(null);

  React.useEffect(() => {
    if (socket.current === null) {
      const ws = io();
    }
  }, []);

  return (
    <SockContext.Provider value={{ user: state }}>
      <Auth />
      {children}
    </SockContext.Provider>
  );
}

export default SockProvider;
