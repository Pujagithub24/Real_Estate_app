import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUsers = []; // Use plural for consistency

const addUser = (userId, socketId) => {
  const existingUser = onlineUsers.find((user) => user.userId === userId);
  if (!existingUser) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id); 
 // Log connection for debugging

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log("New user joined:", userId); // Log user join for debugging
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);

    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data);
      console.log("Message sent to:", receiverId); // Log message sent for debugging
    } else {
      console.error(`Failed to send message: Receiver with ID ${receiverId} not found`); // Log error for debugging
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("A user disconnected:", socket.id); // Log disconnection for debugging
  });
});

// Start the server on port 4000 (assuming no other process is using it)
io.listen(4000, () => {
  console.log("Server listening on port 4000");
});

// import { Server } from "socket.io";

// const io = new Server({
//   cors: {
//     origin: "http://localhost:5173",
//   },
// });

// let onlineUser = [];

// const addUser = (userId, socketId) => {
//   const userExits = onlineUser.find((user) => user.userId === userId);
//   if (!userExits) {
//     onlineUser.push({ userId, socketId });
//   }
// };

// const removeUser = (socketId) => {
//   onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
// };

// const getUser = (userId) => {
//   return onlineUser.find((user) => user.userId === userId);
// };

// io.on("connection", (socket) => {
//   socket.on("newUser", (userId) => {
//     addUser(userId, socket.id);
//   });

//   socket.on("sendMessage", ({ receiverId, data }) => {
//     const receiver = getUser(receiverId);
//     io.to(receiver.socketId).emit("getMessage", data);
//   });

//   socket.on("disconnect", () => {  //to remove our user from the onlineUser[] array
//     removeUser(socket.id);
//   });
// });

// io.listen("4000");