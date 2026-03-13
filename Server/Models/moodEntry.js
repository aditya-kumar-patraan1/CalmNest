import mongoose from "mongoose";

const schema = new mongoose.Schema({
    userId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    },
    mood: {
        required: true,
        type: String
    },
    intensity_level: {
        required: true,
        type: Number
    },
    energy_level: {
        required: true,
        type: Number
    },
    stress_level: {
        required: true,
        type: Number
    },
    dailyPour: {
        required: true,
        type: String
    },
    sleepHours: {
        required: true,
        type: Number
    },
    sleepQuality: {
        required: true,
        type: Number
    },
    bestList: [
        {
            type: String
        }
    ]
}, { timestamps: true });

export const moodEntryModel = new mongoose.model("moodJournal", schema);