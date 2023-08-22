import { PrismaClient } from "@prisma/client";
import express from "express";
import { Server } from "socket.io";
import http from "node:http";
import crypto from "node:crypto";
export const client = new PrismaClient();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let userNum = 0;

io.on("connection", (socket) => {
  socket.emit("user-data", crypto.randomUUID());

  socket.on("chat-message", (arg) => {
    console.log(arg);
    io.emit("chat", "penis");
  });
});

app.get("/", (req, res) => {
  res.send("<h1>Alive!</h1>");
});

server.listen(3001, () => {
  console.log("App started to work");
});
