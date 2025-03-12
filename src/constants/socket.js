const { Server } = require("socket.io");
const http = require("http");

const userSockets = new Map(); 
let io;


  const socketHandler = (server) => {
    io = new Server(server, {
      cors: { origin: "*" },
    });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // socket.on("register", (userId) => {
    //   userSockets.set(userId.toString(), socket.id);
    //   console.log(`User registered: ${userId} -> Socket ID: ${socket.id}`);
    // });

    socket.on("register", (userId) => {
        if (!userId) {
          console.log("Invalid userId received for registration.");
          return;
        }
  
        userId = userId.toString(); 
        userSockets.set(userId, socket.id);
        console.log(`User registered: ${userId} -> Socket ID: ${socket.id}`);
      });

    socket.on("sendMessage", (data) => {
        console.log("Message received:", data);

        const { receiverId, message } = data;
        if (!receiverId || !message) {
          console.log("Invalid message data.");
          return;
        }
  
  
        const receiverSocketId = userSockets.get(data.receiverId?.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", data);
          console.log(`Message sent to user ${data.receiverId}`);
        } else {
          console.log(`User ${data.receiverId} is not connected.`);
        }
      });

    // socket.on("message", (data) => {
    //   console.log("Received:", data);
    //   socket.emit("response", `Server received: ${data}`);
    // });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`User ${userId} disconnected.`);
          break;
        }
      }
      console.log("User disconnected:", socket.id);
    });
  });
};

const emitToUser = (userId, event, data) => {
  userId = userId.toString();
  const socketId = userSockets.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
    console.log(`Emitted event '${event}' to user ${userId}`);
  } else {
    console.log(`User ${userId} is not connected.`);
  }
};

module.exports = { socketHandler, emitToUser };
