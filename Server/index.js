const express = require("express");
const cors = require("cors");
const router = require("./Routers/getAddressRouter");
const app = express();
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const connectDB = require("./Config/mongodb");
const http = require("http");
const server = http.createServer(app);
const myRouter = require("./Routers/authRoutes");
const router3 = require("./Routers/userDataRoutes");
const router8 = require("./Routers/appointmentRoutes");
const Router9 = require("./Routers/DashboardRoutes");
const Router10 = require("./Routers/uploadHealthRecordRoutes");
const Router12 = require("./Routers/ContactRoutes");
const router1 = require("./Routers/MoodDetectorRouter");

require("dotenv").config();
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true                 // 👈 this is REQUIRED to allow cookies
}));

connectDB(); 

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true // 👈 this is REQUIRED to allow cookies
    }
});


app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", myRouter);
app.use("/api/userData",router3);
app.use("/api", router);
app.use("/api/appointment",router8);
app.use("/api/dashboard",Router9);
app.use("/api/record",Router10);
app.use("/api/feedback",Router12);
app.use("/api/mood_analysis",router1);

const PORT = process.env.PORT || 5000;
const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

const dataMappings = {};

const helper = async (roomid) => {
  const room = io.sockets.adapter.rooms.get(roomid);
  if (!room) return [];

  return Array.from(room).map((socketid) => ({
    username: dataMappings[socketid] || null,
    socketid: socketid,
  }));
};

io.on("connection", (socket) => {
    // console.log("User joined room:", socket.id);
    socket.on("room:join", async (data) => {
        const { email, room } = data;
        emailToSocketIdMap.set(email, socket.id);
        socketidToEmailMap.set(socket.id, email);
        dataMappings[socket.id] = email;
        await socket.join(room);
        console.log("Current name is : "+email);
        const allClients = await helper(room);
        // console.log(allClients);
        io.to(room).emit("user:joined", { email, id: socket.id });
        io.to(socket.id).emit("room:join", data);
        console.log("Sending all:users to room", room, "with data:", allClients);
        io.emit("all:users",allClients);
    });


    socket.on("user:call", ({ to, offer }) => {
        io.to(to).emit("incomming:call", { from: socket.id, offer });
    });

    socket.on("call:accepted", ({ to, ans }) => {
        io.to(to).emit("call:accepted", { from: socket.id, ans });
    });

    socket.on("peer:nego:needed", ({ to, offer }) => {
        // console.log("peer:nego:needed", offer);
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
        // console.log("peer:nego:done", ans);
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });

    socket.on("call:ended", ({ to }) => {
        io.to(to).emit("call:ended");
    });

    socket.on("camera:toggle", ({ to, email, newCameraState }) => {
        socket
            .to(to)
            .emit("camera:toggle", { from: socket.id, email, newCameraState });
    });

    socket.on("messages:sent", ({ to, currMsg }) => {
        // console.log(currMsg);
        socket.broadcast.emit("messages:sent", { from: socket.id, currMsg });
    });

    socket.on("micMsg", ({ socketid, micMsg }) => {
        socket.broadcast.emit("micMsg", { from: socket.id, micMsg });
    })

    socket.on("send:opponent_from_calling",({opponentName})=>{
        // console.log("backend se bhejra hu bhai m opponent ka name");
        socket.broadcast.emit("get:opponent_from_calling",{from:socket.id,opponentName});
    })

})

server.listen(process.env.PORT || 8000, () => {
    // console.log("Server is running...");
});

// app.listen(PORT, () => {
//     // console.log(`Server is running on port ${PORT}`);
// })