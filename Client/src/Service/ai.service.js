import { GoogleGenAI } from "@google/genai";

const APIKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: APIKey });

async function mainToMoodGemini(prompt) {

    // console.log("started");

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",

        contents: `You are an emotion classification system.

Task:
Identify the primary emotion expressed in the user's text.

Rules:
- Respond with ONLY one word.
- The word MUST be selected from the list below.
- Do NOT explain your answer.
- Do NOT add punctuation or extra words.
- If the emotion is unclear, return "neutral".

Allowed emotions:
sad, angry, fearful, disgusted, stressed, tired, frustrated, bored, lonely,
happy, surprised, calm, excited, confident, grateful, curious, loved, neutral

User text:
"${prompt}"

Response:
    `,

    });
    // console.log("Analysed by AI is : ");
    // console.log(response);
    // console.log(response.text);

    return response.text.trim();
}

export default mainToMoodGemini;