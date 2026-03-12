import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI=process.env.MONGO_URI;

const dbConnect = async () => {
    try{
        await mongoose.connect(MONGO_URI);
        console.log("Mongo connected");
    }
    catch(e){
        console.log("Mongo atlas not connected to Calmnest");
    }
} 

export default dbConnect;