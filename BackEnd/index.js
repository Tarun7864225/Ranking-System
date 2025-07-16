import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import userRoutes from "./Route/userRoute.js"
import claimRoutes from "./Route/claimRoute.js"

dotenv.config();
const app =  express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {cors: {origin: "http://localhost:5173/", methods: ["GET", "POST"] }});
app.set("io", io);
app.use(cors())

app.use('/user',userRoutes)
app.use('/points',claimRoutes)

const startServer = async() =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MONGODB Connected")
        server.listen(process.env.PORT,()=>{
            console.log(`Server running on http://localhost:${process.env.PORT}`);
        })
        io.on("connection", (socket) => {
            console.log("🟢 Client connected:", socket.id);
            socket.on("disconnect", () => {
                console.log("🔴 Client disconnected:", socket.id);
        })})
    } catch (error) {
        console.log("ERROR: MONGODB");
        console.log(error)
        process.exit(1);
    }
};
startServer();