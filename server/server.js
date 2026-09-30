const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

//creating socketIO server, attaching socket.io to existing HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.set("io", io);

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

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
