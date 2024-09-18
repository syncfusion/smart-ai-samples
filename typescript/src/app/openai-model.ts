import OpenAI from "openai";

const OPENAI_API_KEY = "YOUR_API_KEY";

const openAi = new OpenAI({
    apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true
});

export async function OpenAiModel(description: string) {
    const chatCompletion = await getOpenAiModel(description);
    return chatCompletion.choices[0].message.content;
}

export async function getOpenAiModel(query: string) {
    return await openAi.chat.completions.create({
        messages: [{ role: "user", content: query }],
        model: "gpt-3.5-turbo",
    });
}

// Open AI Embedding

export async function OpenAiEmbeddingModel(description: string) {
    const embedding = await openAi.embeddings.create({
        model: "text-embedding-ada-002",
        input: description,
        encoding_format: "float",
      });
    return embedding;
}