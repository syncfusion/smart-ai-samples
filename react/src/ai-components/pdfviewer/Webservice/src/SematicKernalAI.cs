using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using Microsoft.SemanticKernel.Connectors.OpenAI;
using SmartComponents.LocalEmbeddings;

namespace EJ2APIServices_NET8
{
    public class SematicKernalAI
    {
        public Dictionary<string, EmbeddingF32>? PageEmbeddings { get; set; }
        const string endpoint = "YOUR-ENDPOINT";
        const string deploymentName = "DEPLOYMENT-NAME";
        internal string key = string.Empty;
        IChatCompletionService chatCompletionService;
        Kernel kernel;

        public SematicKernalAI(string key)
        {
            this.key = key;
            var builder = Kernel.CreateBuilder().AddAzureOpenAIChatCompletion(deploymentName, endpoint, key);
            kernel = builder.Build();
            chatCompletionService = kernel.GetRequiredService<IChatCompletionService>();
        }

        public async Task Initialize(string[] chunks)
        {
            var embedder = new LocalEmbedder();
            PageEmbeddings = chunks.Select(x => KeyValuePair.Create(x, embedder.Embed(x))).ToDictionary(k => k.Key, v => v.Value);
        }

        public async Task<string> GetAnswerFromGPT(string systemPrompt)
        {
            List<string> message = PageEmbeddings.Keys.Take(10).ToList();
            var history = new ChatHistory();
            history.AddSystemMessage(systemPrompt);
            history.AddUserMessage(String.Join(" ", message));
            OpenAIPromptExecutionSettings openAIPromptExecutionSettings = new()
            {
                ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions
            };
            var result = await chatCompletionService.GetChatMessageContentAsync(history,executionSettings: openAIPromptExecutionSettings,kernel: kernel);
            return result.ToString();
        }

        private async Task<string> GetAnswerFromGPT(string systemPrompt, string message)
        {
            var history = new ChatHistory();
            history.AddSystemMessage(systemPrompt);
            history.AddUserMessage(message);
            OpenAIPromptExecutionSettings openAIPromptExecutionSettings = new()
            {
                ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions
            };
            var result = await chatCompletionService.GetChatMessageContentAsync(history,executionSettings: openAIPromptExecutionSettings,kernel: kernel);
            return result.ToString();
        }

        internal async Task<string> GetSmartFillFromGPT(string userPrompt)
        {
            try
            {
                var history = new ChatHistory();
                history.AddUserMessage(userPrompt);
                OpenAIPromptExecutionSettings openAIPromptExecutionSettings = new()
                {
                    ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions
                };
                var result = await chatCompletionService.GetChatMessageContentAsync(
                    history,
                    executionSettings: openAIPromptExecutionSettings,
                    kernel: kernel);

                return result.ToString();
            }
            catch
            {
                // Return an empty string if an exception occurs
                return " ";
            }
        }

        public async Task<string> AnswerQuestion(string question)
        {
            var embedder = new LocalEmbedder();
            var questionEmbedding = embedder.Embed(question);
            var results = LocalEmbedder.FindClosestWithScore(questionEmbedding, PageEmbeddings.Select(x => (x.Key, x.Value)), 5, 0.5f);
            StringBuilder builder = new StringBuilder();
            foreach (var result in results)
            {
                builder.AppendLine(result.Item);
            }
            string message = builder.ToString();
            var answer = await GetAnswerFromGPT("You are a helpful assistant. Use the provided PDF document pages and pick a precise page to answer the user question, proivde a reference at the bottom of the content with page numbers like ex: Reference: [20,21,23]. Pages: " + message, question);
            return answer;
        }
    }
}
