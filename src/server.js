import app from "./app.js";
import "./mongo.js";
import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import { MessageModel } from "./models/MessageModel.js";

const port = 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(new Error("Authentication error"));
    socket.user = user.user;
    next();
  });
}).on("connection", (socket) => {
  console.log("a user connected:", socket.user);

  socket.on("join group", (groupId) => {
    socket.join(groupId);

    MessageModel.find({ groupId }).then((messages) => {
      socket.emit("chat history", messages);
    });
  });

  socket.on("chat message", (data) => {
    const message = new MessageModel({
      senderId: socket.user,
      message: data.message,
      groupId: data.groupId,
    });
    message.save().then(() => {
      io.to(data.groupId).emit("chat message", message);
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.user);
  });
});

httpServer.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
