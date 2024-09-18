import { GoogleGenerativeAI  } from '@google/generative-ai';

const GEMINI_API_KEY = "YOUR_API_KEY";

const client = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function geminiModel(description: string) {
    const content = await generateAIContent(description);
    return content;
}

export async function generateAIContent(description: string) {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = client.getGenerativeModel({ model: "gemini-1.5-flash"});
  
    //const description = "Write a story about a magic backpack."
  
    const result = await model.generateContent(description);
    const response = await result.response;
    return response.text();
}

