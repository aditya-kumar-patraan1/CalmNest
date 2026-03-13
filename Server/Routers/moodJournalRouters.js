import express from "express";
import { userauth } from "../MiddleWare/userauth.js";
import { addMoodJournalEntry, getMoodEntries } from "../Controllers/moodJournalController.js";

export const moodJournalRouter = express.Router();

moodJournalRouter.post("/addMoodJournal",userauth,addMoodJournalEntry);
moodJournalRouter.get("/getMoodEntries",userauth,getMoodEntries);