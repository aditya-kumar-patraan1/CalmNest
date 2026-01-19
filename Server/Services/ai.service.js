const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const myAPIKey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenerativeAI(myAPIKey);
// console.log("API Key:", myAPIKey ? "Loaded" : "Missing");


const main = async (prompt) => {
    const model = ai.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: `You are an expert emotion classification AI. Your sole function is to analyze the user's text and determine their primary emotional state.
        
        You MUST respond with only a single, lowercase word. Choose the most fitting word from this exclusive list of 18 core emotions:
        happy, sad, angry, fearful, surprised, disgusted, calm, excited, stressed, tired, confident, grateful, frustrated, curious, bored, loved, lonely, neutral
        
        CRITICAL RULES:
        1.  Your response must be EXACTLY one word from the list.
        2.  Do not use capitalization or punctuation.
        3.  Do not provide any explanation, greetings, or apologies.
        4.  If the text is vague, a question, or doesn't express a clear mood, respond with 'neutral'.`
        
    });
    
    console.log(prompt);
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    console.log("in hehehe api");
    const finalReply = await response.replace(/\n/g, '').trim();
    console.log(finalReply);
    return finalReply;
};


module.exports = { main };