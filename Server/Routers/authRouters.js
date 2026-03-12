import express from "express"
import { loginUser, registerUser,testing } from "../Controllers/authController.js";
import userauth from "../MiddleWare/userauth.js";

export const router=express.Router();

router.post("/v1/register",registerUser);   //for registering the calmnest user
router.post("/v1/login",loginUser);
router.post("/v1/testing",userauth,testing);