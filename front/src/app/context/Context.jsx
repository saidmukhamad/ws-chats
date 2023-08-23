import React from "react";
import { link } from "../../shared/constants/url";

const defaultContextValue = {
  user: {
    loggedIn: false,
    email: "",
  },
  logIn: () => console.error("Log in not defined"),
  logOut: () => console.error("Log out not defined"),
  signIn: () => console.error("signIn out not defined"),
};

export const Context = React.createContext(defaultContextValue);

/**
 * @description Context for user data
 * @returns
 */
function ContextProvider({ children }) {
  const [state, setState] = React.useState({
    loggedIn: false,
    email: "",
  });

  const signIn = (email, password) => {
    const request = fetch(`${link}/auth/reg`, {
      method: "POST",
      credentials: "include",
      body: {
        email,
        password,
      },
    });

    request
      .then((d) => {
        setState({
          loggedIn: true,
          email,
        });
        localStorage.setItem("email", email);
      })
      .catch((e) => console.error(e));
  };

  const logIn = (email) => {
    const request = fetch(`${link}/auth/log`, {
      credentials: "include",

      method: "POST",
      body: {
        email,
      },
    });

    request
      .then((d) => {
        setState({
          loggedIn: true,
          email,
        });
        localStorage.setItem("email", email);
      })
      .catch((e) => console.error(e));
  };

  const logOut = () => {
    setState({
      loggedIn: false,
      email: "",
    });
    const request = fetch(`${link}/auth/logout`, {
      credentials: "include",
    })
      .then((d) => localStorage.removeItem("email"))
      .catch((e) => console.error(e));
  };

  React.useLayoutEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setState({
        loggedIn: true,
        email,
      });
    }
  }, []);

  return (
    <Context.Provider value={{ user: state, logIn, logOut, signIn }}>
      {children}
    </Context.Provider>
  );
}

export default ContextProvider;
