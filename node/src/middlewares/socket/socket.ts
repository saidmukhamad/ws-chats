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

export interface ServerEvents {
  "chat:create": (users, callback) => void;
  "chat:join": (chatId, callback) => void;
  "chat:sendMessage": (chatId, message, callback) => void;
  "chat:look": (chatId, callback) => void;
  "chat:list": (list: number) => void;
  "chat:messages": (id: string, page: number) => void;
  users: (list: number) => void;
}

const activeUsers = new Map<string, Set<string>>();

export class SockerServer {
  private server: Server<
    ServerEvents,
    any,
    any,
    { cookies: { email: string }; email: string; id: string }
  >;

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
            const parsedCookies: { email: string } = parse(cookies) as {
              email: string;
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
            socket.data.email = parsedCookies.email;
            socket.data.id = data.id;

            if (activeUsers.has(data.email)) {
              activeUsers.set(
                data.email,
                activeUsers.get(data.email)?.add(socket.id) as Set<string>
              );
            } else
              activeUsers.set(data.email, new Set<string>().add(socket.id));
            next();
          }
        } catch (error) {
          const err = new Error("not authorized");
          err.message = "Please retry later";
          next(err);
        }
      });

      socket.on("users", async (page) => {
        try {
          const users = await client.user.findMany({
            skip: 10 * page,
            where: {
              email: {
                not: socket.data.email,
              },
            },
            select: {
              id: true,
              email: true,
            },
          });

          socket.emit("users", users);
        } catch (e) {
          console.log(e);
        }
      });

      socket.on("chat:messages", async (id: string, page: number) => {
        try {
          const data = await client.chat.findUnique({
            where: {
              id: id,
            },
            include: {
              messages: {
                orderBy: {
                  createdAt: "desc",
                },
                skip: page,
              },
            },
          });

          socket.emit("chat:messages", data);
        } catch (error) {
          console.log(error);
        }
      });

      socket.on(
        "chat:create",
        async (users: string[] | { id: string }[], callback) => {
          try {
            users = users.map((id) => ({ id }));
            const chat = await client.chat.create({
              data: {
                participants: {
                  connect: users,
                },
              },
              include: {
                participants: true,
              },
            });

            if (chat) {
              const socketIds: string[] = [];
              for (let id of chat.participantsId) {
                const test = activeUsers.get(id) ?? [];
                socketIds.push(...(activeUsers.get(id) ?? []));
              }

              for (let s of socketIds) {
                socket.to(s).emit("chat:create", {
                  chatId: chat.id,
                  participants: chat.participantsId,
                });
              }
            }
          } catch (error) {}
        }
      );

      socket.on(
        "chat:sendMessage",
        async (chatId: string, message: string, callback) => {
          try {
            const chat = await client.chat.update({
              where: {
                id: chatId,
              },
              data: {
                messages: {
                  create: {
                    body: message,
                    sender: {
                      connect: {
                        email: socket.data.email,
                      },
                    },
                  },
                },
              },
              include: {
                participants: {
                  select: {
                    id: true,
                    email: true,
                  },
                },
              },
            });

            if (chat) {
              const socketIds: string[] = [];
              for (let id of chat.participantsId) {
                const test = activeUsers.get(id) ?? [];
                socketIds.push(...(activeUsers.get(id) ?? []));
              }

              for (let s of socketIds) {
                socket.to(s).emit("chat:create", {
                  chatId: chat.id,
                  emails: chat.participants,
                });
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      );

      socket.on("chat:look", async (chatId, callback) => {
        try {
          const look = await client.chat.findUnique({
            where: {
              id: chatId,
            },
            include: {
              messages: true,
            },
          });

          socket.emit("chat:lookup", look);
        } catch (error) {}
      });

      socket.on("chat:list", async (page) => {
        try {
          const list = await client.chat.findMany({
            where: {
              participantsId: {
                has: socket.data.id,
              },
            },
          });
        } catch (error) {
          console.log(error);
        }
      });

      socket.on("disconnecting", () => {
        let data: Set<string> = activeUsers.get(socket.data.email) ?? new Set();
        data.delete(socket.id);
        if (data.size === 0) {
          activeUsers.delete(socket.data.email);
        } else activeUsers.set(socket.data.email, data);
      });

      socket.on("chat:list", () => {});
    });

    this.server.on("connect_error", (err) => {
      console.log(err instanceof Error); // true
      console.log(err.message); // not authorized
      console.log(err.data); // { content: "Please retry later" }
    });
  }

  private chatsListeners(): void {}
}
