import { Server, ServerOptions, Socket } from "socket.io";
import type { Server as HTTPSServer } from "https";
import { parse } from "cookie";
import { client } from "../../util/helpers/prismaClient";
import { UserChatCreateManyChatInput } from "@prisma/client/generator-build/index";
import { randomUUID } from "node:crypto";
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
  trigger: () => void;
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

      socket.on("trigger", () => {
        Array.from(activeUsers).forEach((s) => {
          Array.from(s[1]).forEach((id) => {
            socket.to(id).emit("trigger", "asd");
          });
        });
        socket.emit("trigger", "asd");
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
      socket.on("chat:create", async (chatParticipant: string, callback) => {
        try {
          const users = [chatParticipant, socket.data.id];
          const usersId = users.map((id) => ({ id }));

          const chat = await client.chat.create({
            data: {
              name: randomUUID(),
              userChats: {
                createMany: {
                  data: [
                    ...(usersId.map((data) => ({
                      userId: data.id,
                    })) as UserChatCreateManyChatInput),
                  ],
                },
              },
            },
            include: {
              userChats: {
                include: {
                  user: {
                    select: {
                      email: true,
                    },
                  },
                },
              },
            },
          });

          if (chat) {
            const socketIds: string[] = [];
            for (let id of chat.userChats) {
              const users = chat.userChats.map((v) => v.user.email);
              const test = (
                users.map((d) => Array.from(activeUsers.get(d) ?? new Set())) ??
                []
              ).flat() as string[];

              console.log(test, "test");

              socketIds.push(...(test ?? []));
            }

            for (let s of socketIds) {
              socket.to(s).emit("chat:create", {
                chatId: chat.id,
                participants: users,
              });
            }
          }
        } catch (error) {
          console.log(error);
        }
      });

      socket.on(
        "chat:sendMessage",
        async (chatId: string, message: string, callback) => {
          try {
            const chat = await client.message.create({
              data: {
                body: message,
                chat: {
                  connect: {
                    id: chatId,
                  },
                },
                sender: {
                  connect: {
                    id: socket.data.id,
                  },
                },
              },
              include: {
                chat: {
                  include: {
                    userChats: {
                      select: {
                        user: {
                          select: {
                            email: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            });

            if (chat) {
              const socketIds: string[] = [];
              const participants: string[] = [];
              for (let id of chat.chat.userChats) {
                const test = activeUsers.get(id.user.email) ?? [];
                participants.push(id.user.email);
                socketIds.push(...Array.from(test));
              }

              for (let s of socketIds) {
                socket.to(s).emit("chat:sendMessage", {
                  chatId: chat.id,
                  message,
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

      socket.on("chat:list", async (page = 0) => {
        try {
          const list = await client.userChat.findMany({
            where: {
              userId: socket.data.id,
            },
            skip: 15 * page,
            orderBy: {
              createdAt: "desc",
            },
            select: {
              chat: {
                select: {
                  id: true,
                  messages: {
                    orderBy: {
                      createdAt: "desc",
                    },
                    take: 1,
                    select: {
                      body: true,
                      senderId: true,
                    },
                  },
                  userChats: {
                    select: {
                      user: {
                        select: {
                          email: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          });

          const data = list.map((l) => ({
            id: l.chat.id,
            messages: l.chat.messages,
            users: l.chat.userChats.map((d) => d.user.email),
          }));

          socket.emit("chat:list", data);
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
