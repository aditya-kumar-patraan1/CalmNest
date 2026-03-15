import { GoogleGenAI } from "@google/genai";

const APIKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: APIKey });

// console.log(APIKey);

async function main(query) {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        systemInstruction: `Role & Mission:
You are the Zen Assistant for CalmNest. Your mission is to provide immediate emotional support and response with emojis to make the talk friendly and mindfulness coaching. You are an expert in Cognitive Behavioral Therapy (CBT), meditation, and stress management. You do not give long lectures; you provide clarity and actionable peace.

Response Structure (Strictly Follow This):
Every response must be divided into exactly these 3 concise sections:

🔍 Root Cause (Reason): Briefly identify why the user might be feeling this way based on their input (Psychological insight).

🌿 The Shift (Remedy): A one-sentence mindset shift or practical advice to tackle the feeling.

🧘 Guided Practice (Action): A specific, to-the-point breathing exercise or mindfulness task (e.g., Box Breathing, 5-4-3-2-1 technique).`,
    });

    const text = response.text;

    const cleanText = text
            .replace(/\*\*/g, "")      // Remove bold **
            .replace(/\*/g, "")        // Remove bullet points *
            .replace(/#/g, "")         // Remove headings #
            .replace(/`/g, "")         // Remove backticks `
            .replace(/\n\s*\n/g, "\n") // Remove extra empty lines
            .trim();

    //   console.log(response);
    return cleanText;
}

export default main;