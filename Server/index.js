import express from "express";
import dbConnect from "./Config/mongoconnect.js";
import dotenv from "dotenv";
import { router } from "./Routers/authRouters.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./Routers/UserDataRouters.js";
import { moodJournalRouter } from "./Routers/moodJournalRouters.js";
import http from "http";
import {Server} from "socket.io";
const app = express();
// const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
    },
})

dotenv.config();

const LOCALHOST = process.env.LOCALHOST || 8000;
dbConnect();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}))
//middleware+cookie-parser+cors then routes
app.use("/api/v1", router);
app.use("/api/v2", userRouter);
app.use("/api/v3", moodJournalRouter);

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();


const dataMappings = {};

const helper = (roomid) => {
  const room = io.sockets.adapter.rooms.get(roomid);
  if (!room) return [];

  return Array.from(room).map((socketid) => ({
    username: dataMappings[socketid] || null,
    socketid: socketid,
  }));
};

io.on("connection", (socket) => {
  // console.log(`User connected ${socket.id}`);

  socket.on("join", ({ roomid, username }) => {
    dataMappings[socket.id] = username;
    socket.join(roomid);

    const allClients = helper(roomid);
    // console.log(allClients);

    io.to(roomid).emit("joined", {
      clients: allClients,
      socketid: socket.id,
      username: username,
    });
  });

  socket.on("room:join", (data) => {
    // console.log("reached");
    const { email, room } = data;
    emailToSocketIdMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(room).emit("user:joined", { email, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit("room:join", data);
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
  
  socket.on("micMsg",({socketid,micMsg})=>{
    socket.broadcast.emit("micMsg",{from:socket.id,micMsg});
  })

  socket.on("user-leave", () => {
    // console.log("disconnecting activated...");

    const rooms = [...socket.rooms];

    if (dataMappings[socket.id]) {
      rooms.forEach((roomid) => {
        socket.to(roomid).emit("user-leaved", {
          username: dataMappings[socket.id],
          socketid: socket.id,
        });
      });

      delete dataMappings[socket.id];
    }
    socket.leave();
  });

  socket.on("code-change", ({ username,roomid, code }) => {
    // console.log("Code-change activated");
    if (roomid && code !== undefined) {
      socket.to(roomid).emit("code-changed", {whoChanged:username,ChangerSocketId:socket.id,code });
      socket.to(roomid).emit("show-who-changed",{whoChanged:username});
    }
  });

  socket.on("disconnect", () => {
    // console.log(`User disconnected ${socket.id}`);
    delete dataMappings[socket.id];
  });

  socket.on("sync-code", ({ socketid, code }) => {
    io.to(socketid).emit("code-changed", { code });
  });
});

app.get("/homePage", (req, res) => {
  res.send("This is my Home Page");
});

app.get("/healthCheck", (req, res) => {
    res.json({ message: "I am working well" });
});

server.listen(LOCALHOST, (req, res) => {
    // console.log(`App is running... on localhost : ${LOCALHOST}`);
})