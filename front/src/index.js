import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ContextProvider from "./app/context/Context";
import SockProvider from "./app/socketManager";
const root = ReactDOM.createRoot(document.getElementById("root"));
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <App />,
  },
]);

root.render(
  <React.StrictMode>
    <ContextProvider>
      <SockProvider>
        <RouterProvider router={router} />
      </SockProvider>
    </ContextProvider>
  </React.StrictMode>
);
