import express from "express"
import { loginUser, logoutUser, registerUser } from "../Controllers/authController.js";
import {userauth} from "../MiddleWare/userauth.js";

export const router=express.Router();

router.post("/register",registerUser);   //for registering the calmnest user
router.post("/login",loginUser);
router.delete("/logout",userauth,logoutUser);