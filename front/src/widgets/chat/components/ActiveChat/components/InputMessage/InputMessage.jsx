import React from "react";

function InputMessage({ message, email }) {
  console.log(message);
  return (
    <div className="message">
      <p
        data-sender={`${message.sender == email ? "1" : 0}`}
        className="sender"
      >
        sender {message.sender}
      </p>
      {!message.read.read && <p>не прочитано</p>}

      <p className="message-body">{message.body}</p>
    </div>
  );
}

export default InputMessage;
