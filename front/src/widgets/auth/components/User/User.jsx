import React from "react";
import LogIn from "../Login/Login";
import SignIn from "../SignIn/SignIn";
import { Context } from "../../../../app/context/Context";

function User() {
  const ctx = React.useContext(Context);
  const [mode, setMode] = React.useState(0);

  return (
    <div className="auth-container">
      {!ctx.user.loggedIn ? (
        mode === 0 ? (
          <SignIn />
        ) : (
          <LogIn />
        )
      ) : (
        <div>
          <div>
            <h2>User data</h2>
            <p>{ctx.user.email}</p>
          </div>
          <div>
            <button onClick={ctx.logOut}>logout</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default User;
