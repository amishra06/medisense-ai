import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.VITE_GEMINI_API_KEY || "AIzaSyCZ61MliZ3tJDkP4Op25kS38Mx9lO1gN3o"; // Fallback to what was in .env.local

const ai = new GoogleGenAI({ apiKey });

async function listModels() {
    try {
        console.log("Fetching models...");
        const response = await ai.models.list();
        console.log("Available models:");
        // The response structure depends on the SDK version, printing raw first
        // console.log(JSON.stringify(response, null, 2)); 

        // Attempting to iterate if it's iterable
        for await (const model of response) {
            console.log(`- ${model.name}`);
            console.log(`  Supported methods: ${model.supportedGenerationMethods}`);
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
