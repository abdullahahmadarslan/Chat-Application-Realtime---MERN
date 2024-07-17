const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});
// getting socket id of a specific user
const getSocketId = (userId) => {
  return onlineUsers[userId];
};

// keeping a track of all online users
const onlineUsers = {};

// when a user connects
io.on("connection", (socket) => {
  console.log("user with socket id connected", socket.id);
  const userId = socket.handshake.query.userId;
  console.log(userId);

  if (userId != "undefined") {
    onlineUsers[userId] = socket.id;
    console.log("connection, online users: ", onlineUsers);
  }
  io.emit("updateOnlineUsers", Object.keys(onlineUsers));
  //   when a specific user disconnects
  socket.on("disconnect", () => {
    if (userId) {
      console.log("user with socket id disconnected", socket.id);
      delete onlineUsers[userId];
      console.log("disconnection, online users: ", onlineUsers);
      io.emit("updateOnlineUsers", Object.keys(onlineUsers));
    }
  });
});

//exporting
module.exports = { io, server, app, getSocketId };
