import { PrismaClient } from "@prisma/client";
import express from "express";
import { Server } from "socket.io";
import http from "node:http";
import crypto from "node:crypto";
import { SocketAddress } from "node:net";
export const client = new PrismaClient();
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedList = [
  "http://localhost:3000",
  "http://192.168.0.106:3000",
  "http://localhost:5173",
  "http://85.193.90.116:3000",
];

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: allowedList,
  })
);
app.use(cookieParser());
const server = http.createServer(app);

app.use((req, res, next) => {
  console.log(req.cookies, "cookies");

  res.cookie("123", "123");
  next();
});

const io = new Server(server, {
  cors: {
    origin: allowedList,
    credentials: true,
  },
});

let userNum = 0;
app.get("/cookie", (req, res) => {
  res.cookie("test", "test", {
    maxAge: 30 * 24 * 3600000,
    httpOnly: true,
    secure: false,
  });
  console.log("here was");
  res.status(200).json({
    ok: true,
    data: "test",
  });
});

app.post('/login', ())

io.on("connection", (socket) => {
  socket.use((conn, next) => {
    next();
  });

  socket.emit("user-data", crypto.randomUUID());

  socket.on("chat-message", (arg) => {
    console.log(arg, "args");
    io.emit("chat", "penis");
  });

  socket.on("m/:id", (arg) => {
    console.log("this vhat");
  });
});

app.get("/", (req, res) => {
  res.send("<h1>Alive!</h1>");
});

server.listen(3001, () => {
  console.log("App started to work");
});
