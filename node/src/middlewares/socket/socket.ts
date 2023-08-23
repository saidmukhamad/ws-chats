import { Server, ServerOptions } from "socket.io";
import http from "node:http";
import { Http2SecureServer } from "node:http2";
import type { Server as HTTPSServer } from "https";

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
      socket.on("msg", (arg) => {
        console.log(arg);
        console.log("socket");
        console.log("connected");
      });

      socket.emit("user-data", "pennnnnnnn");
    });
  }
}
