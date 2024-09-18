import Groq from "groq-sdk";

const META_API_KEY = "YOUR_API_KEY";

const groq = new Groq({ apiKey: META_API_KEY, dangerouslyAllowBrowser: true });

export async function metaModel(description: string) {
  const chatCompletion = await getGroqChatCompletion(description);
  return chatCompletion.choices[0]?.message?.content || "";
}

export async function getGroqChatCompletion(query: string) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: query,
      },
    ],
    model: "llama3-8b-8192",
  });
}
