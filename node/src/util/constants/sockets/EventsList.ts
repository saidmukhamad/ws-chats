import { Server } from "socket.io";
import { EventsMap } from "socket.io/dist/typed-events";

export interface ClientEvents {
  joinChat: [chatId: string, callback: (error?: string) => void];
  sendMessage: [
    chatId: string,
    messageBody: string,
    callback: (error?: string) => void
  ];
  // ... more events and their payload types
}

// interface ServerEvents {
//   previousMessages: [Message[]]; // assuming Message is some defined type
//   newMessage: [Message];
//   // ... more events and their payload types
// }
