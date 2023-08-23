import { Express } from "express";
import { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "node:http";
import { SockerServer } from "./socket/socket";
import { allowedList } from "../util/constants/allowedList";
import { PORT } from "../util/constants";
import auth from "./routes/auth/index";

export class Middlewares {
  app: Express;
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  socket: SockerServer;

  constructor(app: Express) {
    this.app = app;
    this.initMiddlewares();
    this.server = http.createServer(this.app);
    this.socket = new SockerServer(this.server, {
      cors: {
        origin: allowedList,
        credentials: true,
      },
    });

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
  }

  private initRoutes() {
    this.app.use("/auth/", auth);
  }

  private listen() {
    this.server.listen(PORT, () => {
      console.log("server started", Date.now());
    });
  }

  private initSockets() {}
}
