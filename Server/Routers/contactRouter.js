import express from "express";
import { addFeedback } from "../Controllers/contactController";

export const contactRouter = express.Router();

contactRouter.post(`/addFeedback`,addFeedback);