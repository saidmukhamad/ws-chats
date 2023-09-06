import React from "react";
import ActiveUsers from "./components/ActiveUsers/ActiveUsers";
import { SockContext } from "@components/app/socketManager";

function NewChat() {
  const context = React.useContext(SockContext);

  React.useEffect(() => {
    context.actions.getUsers();
  }, []);

  return (
    <div>
      <ActiveUsers
        create={context.actions.createChat}
        users={context.state.userList}
      />
    </div>
  );
}

export default NewChat;
