const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.set("io", io);

// Socket.IO
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinConversation", (conversationId) => {
    const roomName = `conversation:${conversationId}`;

    socket.join(roomName);

    console.log(`Socket ${socket.id} joined ${roomName}`);
  });

  socket.on("leaveConversation", (conversationId) => {
    const roomName = `conversation:${conversationId}`;

    socket.leave(roomName);

    console.log(`Socket ${socket.id} left ${roomName}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Routes
const messageRoutes = require("./routes/messageRoutes");
const healthRouter = require("./routes/healthRouter");
const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");

app.use(cors());
app.use(express.json());

app.use("/api", messageRoutes);
app.use("/api", healthRouter);
app.use("/api", userRoutes);
app.use("/api", conversationRoutes);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
