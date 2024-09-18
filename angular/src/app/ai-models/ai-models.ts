import { generateText } from "ai"
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAzure } from '@ai-sdk/azure';
import { createOpenAI } from '@ai-sdk/openai';

const google = createGoogleGenerativeAI({
    baseURL: "https://generativelanguage.googleapis.com/v1beta",
    apiKey: "API_KEY"
});
const azure = createAzure({
    resourceName: 'RESOURCE_NAME',
    apiKey: 'API_KEY',
});
const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: 'API_KEY',
});

const aiModel = azure('MODEL_NAME'); // Update the model here

export async function getAzureChatAIRequest(options: any) {
    try {
        const result = await generateText({
            model: aiModel,
            messages: options.messages,
            topP: options.topP,
            temperature: options.temperature,
            maxTokens: options.maxTokens,
            frequencyPenalty: options.frequencyPenalty,
            presencePenalty: options.presencePenalty,
            stopSequences: options.stopSequences
        });
        return result.text;
    } catch (err) {
        console.error("Error occurred:", err);
        return null;
    }
}

export async function getAzureTextAIRequest(query: any) {
    try {
        const result = await generateText({
            model: aiModel,
            prompt: query,
        });
        return result.text;
    } catch (err) {
        console.error("Error occurred:", err);
        return undefined;
    }
}

export async function OpenAiModel(subQuery: any) {
    const chatCompletion = await getOpenAiModel(subQuery);
    return chatCompletion.text;
}

export async function getOpenAiModel(subQuery: any) {
    try {
        const { text } = await generateText({
            model:aiModel,
            prompt: `${subQuery.includes("emoji followed by the sentiment in the format") 
                ? "You are a helpful assistant. Please respond in string format." 
                : "NOTE: Return same html format just do changes content only. don't change html formats."} ${subQuery}`
        });
        return { text };
    } catch (err) {
        console.error('Error occurred:', err);
        return { text: '' };
    }
}

export async function OpenAiModelRTE(subQuery: string, promptQuery: string) {
    const { text } = await generateText({
        model:aiModel,
        messages: [
            { role: "system", content: subQuery.includes("emoji followed by the sentiment in the format") ? "You are a helpful assistant. Please respond in string format." : "NOTE: Return same html format just do changes content only. don't change html formats."},
            { 
                role: "user", 
                content: `${subQuery} ${promptQuery}`
            }
        ],
    });
    return { text };
}

export async function OpenAiModelKanban(promptQuery: string){
    const { text } = await generateText({
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { 
                role: "user", 
                content: `${promptQuery}`
            }
        ],
        model:aiModel,
    });
    return { text };
}