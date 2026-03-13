import express from "express";
import { getUserData } from "../Controllers/userDataController.js";
import {userauth} from "../MiddleWare/userauth.js";

export const userRouter = express.Router();

userRouter.get("/getUserData",userauth,getUserData);