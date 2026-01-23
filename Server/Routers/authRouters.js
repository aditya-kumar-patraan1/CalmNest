import express from "express"
import { registerUser } from "../Controllers/authController.js";
export const router=express.Router();

router.post("/v1/register",registerUser);   //for registering the calmnest user