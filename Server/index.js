import express from "express";
import dbConnect from "./Config/mongoconnect.js";
import dotenv from "dotenv";

const app = express();
dbConnect();
dotenv.config();

const LOCALHOST=process.env.LOCALHOST || 3000;

app.get("/",(req,res)=>{
    return res.send({
        "name":"aditya"
    });
})

app.listen(LOCALHOST,(req,res)=>{
    console.log("App is running...");
})