import { Express } from "express";
import { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "node:http";
import { SockerServer } from "./socket/socket";
import { allowedList } from "../util/constants/allowedList";
import { PORT } from "../util/constants";
import auth from "./routes/auth/index";
import { Server, Socket } from "socket.io";
import { ParsedCookies } from "./socket/socket";
import { ClientEvents } from "../util/constants/sockets/EventsList";
import { globalErrorHandler } from "../util/error/ErrorHandlers";

export class Middlewares {
  app: Express;
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  socketServer: SockerServer;

  constructor(app: Express) {
    this.app = app;
    this.initMiddlewares();

    this.server = http.createServer(this.app);
    this.socketServer = new SockerServer(
      new Server<ClientEvents, ClientEvents>(this.server, {
        cors: {
          origin: allowedList,
          credentials: true,
        },
        cookie: true,
      })
    );
    this.listen();
  }

  private initMiddlewares() {
    const app = this.app;
    app.use(json());
    app.use(
      cors({
        credentials: true,
        origin: allowedList,
      })
    );
    app.use(cookieParser());
    this.initRoutes();
    app.use(globalErrorHandler);
  }

  private initRoutes() {
    this.app.use("/auth/", auth);
  }

  private listen() {
    this.server.listen(PORT, () => {
      console.log("server started", new Date().toString());
    });
  }
}
