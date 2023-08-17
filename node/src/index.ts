import { PrismaClient } from "@prisma/client";
import express from "express";
import { Server } from "socket.io";
import http from "node:http";
export const client = new PrismaClient();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(socket);
  console.log("there is user in socket");

  socket.on("chat-message", (arg) => {
    console.log(arg);
    io.emit("chat", "penis");
  });
});

app.get("/", (req, res) => {
  res.send("<h1>Alive!</h1>");
});

server.listen(3000, () => {
  console.log("App started to work");
});
