export class ChatStore {
  constructor(data) {
    this.chatsMap = new Map();
    if (data) {
      console.log(data);
      if (data instanceof ChatStore) {
        this.chatsMap = data.chatsMap;
      } else {
        this.populateFromData(data);
      }
    }
  }

  populateFromData(data) {
    if (data instanceof Array) {
      for (const chat of data) {
        const usersObject = [];
        chat.users.forEach((user) => {
          usersObject.push(user);
        });

        this.chatsMap.set(chat.id, {
          messages: chat.messages,
          users: usersObject,
        });
      }
    } else this.populateFromData([data]);
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
  }

  arr() {
    return Array.from(this.chatsMap);
  }
}
