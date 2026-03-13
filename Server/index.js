import express from "express";
import dbConnect from "./Config/mongoconnect.js";
import dotenv from "dotenv";
import {router} from "./Routers/authRouters.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./Routers/UserDataRouters.js";
import { moodJournalRouter } from "./Routers/moodJournalRouters.js";

const app = express();

dotenv.config();

const LOCALHOST=process.env.LOCALHOST || 8000;
dbConnect();
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:process.env.FRONTEND_URL || "http://localhost:5173",
    credentials:true
}))
//middleware+cookie-parser+cors then routes
app.use("/api/v1",router);
app.use("/api/v2",userRouter);
app.use("/api/v3",moodJournalRouter);

app.get("/healthCheck", (req, res) => {
    res.json({ message: "I am working well" });
});

app.listen(LOCALHOST,(req,res)=>{
    console.log(`App is running... on localhost : ${LOCALHOST}`);
})