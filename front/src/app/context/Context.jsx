import React from "react";
import { instance } from "../../shared/api/instance";

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
    const request = instance.post(`/auth/reg`, {
      email,
      password,
    });

    request
      .then((d) => {
        if (d.status != 500) {
          setState({
            loggedIn: true,
            email,
          });
          localStorage.setItem("email", email);
        } else throw "error from promise";
      })
      .catch((e) => console.error(e));
  };

  const logIn = (email) => {
    const request = instance.post(`/auth/log`, {
      email,
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

    const request = instance
      .get(`/auth/logout`)
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
