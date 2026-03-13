import express from "express";
import { userauth } from "../MiddleWare/userauth.js";
import { addMoodJournalEntry, deleteMoodEntry, getMoodEntries } from "../Controllers/moodJournalController.js";

export const moodJournalRouter = express.Router();

moodJournalRouter.post("/addMoodJournal",userauth,addMoodJournalEntry);
moodJournalRouter.get("/getMoodEntries",userauth,getMoodEntries);
moodJournalRouter.delete("/deleteMoodEntry/:deletedItemId",userauth,deleteMoodEntry)