import { Server, ServerOptions } from "socket.io";
import http from "node:http";
import { Http2SecureServer } from "node:http2";
import type { Server as HTTPSServer } from "https";

const parseCookie = (str: string) =>
  str
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc: any, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

export class SockerServer extends Server {
  constructor(
    srv:
      | undefined
      | Partial<ServerOptions>
      | http.Server
      | HTTPSServer
      | Http2SecureServer
      | number,
    opts?: Partial<ServerOptions>
  ) {
    super(srv, opts);
    this.initHandlers();
  }

  private initHandlers() {
    this.on("connection", (socket) => {
      const cookie = parseCookie(socket.client.request.headers.cookie ?? "");

      socket.on("msg", (arg) => {
        console.log(arg);
        console.log("socket");
        console.log("connected");
      });

      socket.emit("user-data", "pennnnnnnn");
    });
  }
}
