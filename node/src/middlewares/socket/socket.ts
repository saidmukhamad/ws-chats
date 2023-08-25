import { Server, ServerOptions, Socket } from "socket.io";
import http from "node:http";
import { Http2SecureServer } from "node:http2";
import type { Server as HTTPSServer } from "https";
import { parse } from "cookie";
import { client } from "../../util/helpers/prismaClient";
import { User } from "@prisma/client";
export interface ParsedCookies {
  [key: string]: string;
}

enum ClientEvents {
  JoinChat = "joinChat",
  SendMessage = "sendMessage",
  Disconnect = "disconnect",
  // ... any other events you might have
}

type eventsMap = {
  [ClientEvents.SendMessage]: (
    chatId: string,
    callback: (error?: string) => void
  ) => void;
};

export class SockerServer {
  private server: Server<eventsMap, eventsMap, eventsMap>;
  constructor(server_: Server) {
    this.server = server_;
    // this.initHandlers();
    this.setupListeners();
  }

  private setupListeners(): void {
    this.server.on("connection", async (socket) => {
      socket.use(async (sock, next) => {
        try {
          const cookies = socket.handshake.headers.cookie || "";

          if (cookies) {
            const parsedCookies: { email?: string } = parse(cookies) as {
              email?: string;
            };
            if (!parsedCookies.email) {
              throw Error("no cookie");
            }
            socket.data.cookies = parsedCookies;

            const data = await client.user.findUnique({
              where: {
                email: socket.data.cookies.email,
              },
            });

            if (!data) {
              throw Error("not authorized");
            }

            socket.data.user = data;
            next();
          }
        } catch (error) {
          const err = new Error("not authorized");
          err.message = "Please retry later";
          next(err);
        }
      });
    });

    this.server.on("connect_error", (err) => {
      console.log(err instanceof Error); // true
      console.log(err.message); // not authorized
      console.log(err.data); // { content: "Please retry later" }
    });
  }

  private chatsListeners(): void {}
}
