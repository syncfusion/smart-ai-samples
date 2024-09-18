import { AzureOpenAI } from "openai";

// Replace your Azure OpenAI endpoint, apiVersion, deployment and API key here
const endpoint = "AZURE_OPENAI_ENDPOINT";
const apiKey = "AZURE_OPENAI_API_KEY";
const deployment = "DEPLOYMENT_NAME";
const apiVersion = "API_VERSION";

const openAi = new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion,
    deployment,
    dangerouslyAllowBrowser: true
});

export async function OpenAiModel(promptQuery: string){
    const chatCompletion = await getOpenAiModel(promptQuery);
    return chatCompletion.choices[0].message.content;
}

export async function getOpenAiModel(promptQuery: string) {
    return await openAi.chat.completions.create({
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { 
                role: "user", 
                content: `${promptQuery}`
            }
        ],
        model: "gpt-4",
    });
}


