class ChatStore {
  constructor() {
    this.chatsMap = new Map();
  }

  populateFromData(data) {
    for (const chat of data) {
      const messagesObject = {};
      chat.messages.forEach((message) => {
        messagesObject[message] = message;
      });

      const usersObject = {};
      chat.users.forEach((user) => {
        usersObject[user] = user;
      });

      this.chatsMap.set(chat.id, {
        messages: messagesObject,
        users: usersObject,
      });
    }
    return new Map(this.chatsMap);
  }

  updateChatMessages(chatId, newMessages) {
    const chat = this.chatsMap.get(chatId);
    if (chat) {
      newMessages.forEach((message) => {
        chat.messages[message] = message; // Add or update the message
      });
      this.chatsMap.set(chatId, chat);
    } else {
      console.error(`Chat with ID ${chatId} not found.`);
    }
    return new Map(this.chatsMap);
  }

  updateChatUsers(chatId, newUsers) {
    const chat = this.chatsMap.get(chatId);
    if (chat) {
      newUsers.forEach((user) => {
        chat.users[user] = user; // Add or update the user
      });
      this.chatsMap.set(chatId, chat);
    } else {
      console.error(`Chat with ID ${chatId} not found.`);
    }

    return new Map(this.chatsMap);
  }

  // Optional: Getter method to retrieve chat data
  getChat(chatId) {
    return this.chatsMap.get(chatId);
  }
}
