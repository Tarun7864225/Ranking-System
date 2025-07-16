import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import userRoutes from "./Route/userRoute.js";
import claimRoutes from "./Route/claimRoute.js";
import dotenv from "dotenv";


dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// .
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173"}));
app.use(express.json());

// Attach socket instance to app
app.set("io", io);

// Routes
app.use("/user", userRoutes);
app.use("/points", claimRoutes);

// Start Server
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 3000;

    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    io.on("connection", (socket) => {
      console.log("🟢 Socket connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("🔴 Socket disconnected:", socket.id);
      });
    });

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

startServer();
