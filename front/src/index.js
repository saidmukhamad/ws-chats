import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ContextProvider from "./app/context/Context";
import SockProvider from "./app/socketManager";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ContextProvider>
      <SockProvider>
        <App />
      </SockProvider>
    </ContextProvider>
  </React.StrictMode>
);
