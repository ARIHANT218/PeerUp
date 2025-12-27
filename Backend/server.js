import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";

import { connectDB } from "./config/db.js";
import "./config/passport.js";

import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.routes.js";
import matchRoutes from "./routes/match.routes.js";
import userRoutes from "./routes/user.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import groupRoutes from "./routes/group.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import insightRoutes from "./routes/insight.routes.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/insight", insightRoutes);

// Socket.IO connection handling
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }
  // In production, verify JWT token here
  socket.userId = token;
  next();
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  socket.on("send-message", async (data) => {
    // Broadcast to all users in the room
    io.to(data.roomId).emit("new-message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Student Match Platform Backend Running 🚀");
});

connectDB().then(() => {
  httpServer.listen(process.env.PORT, () =>
    console.log(`Server running on ${process.env.PORT}`)
  );
});
