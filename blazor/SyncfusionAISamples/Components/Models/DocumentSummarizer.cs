using SmartComponents.LocalEmbeddings;
using OpenAI.Chat;
using Syncfusion.Blazor.SmartComponents;

namespace SyncfusionAISamples.Models
{
    public class DocumentSummarizerService
    {
        public Dictionary<string, EmbeddingF32> PageEmbeddings { get; set; }
        private List<string> extractedText = new List<string>();
        private string DocumentContent { get; set; } = string.Empty;

        private LocalEmbedder? Embedder;

        private readonly GeminiService _geminiService;
        private readonly OpenAIService _openAIService;
        private readonly GroqService _groqService;
        private AIServiceCredentials _credentials;

        public DocumentSummarizerService(IServiceProvider service)
        {
            _openAIService = service.GetService<OpenAIService>();
            _geminiService = service.GetService<GeminiService>();
            _groqService = service.GetService<GroqService>();
            _credentials = service.GetService<AIServiceCredentials>();
            Embedder = service.GetService<LocalEmbedder>();
        }
        private void CreateEmbeddingChunks(string[] chunks)
        {
            PageEmbeddings = chunks.Select(x => KeyValuePair.Create(x, Embedder.Embed(x))).ToDictionary(k => k.Key, v => v.Value);
        }

        /// <summary>
        /// Get answer from GPT-4o
        /// </summary>
        /// <param name="systemPrompt"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task<string> GetAnswerAsync(string systemPrompt, string message, bool isSummary = false)
        {
            List<string> summaryResults = new();

            // Prepare the list of embeddings if summary mode is enabled
            List<string> embed = isSummary ? PageEmbeddings.Keys.Take(PageEmbeddings.Keys.Count).ToList() : null;

            switch (_credentials.AIService)
            {
                case AIServiceProvider.OpenAI:
                    var openAIRequest = new OpenAIChatParameters
                    {
                        Messages = new List<ChatMessage> { new SystemChatMessage(systemPrompt) }
                    };

                    if (isSummary && embed != null)
                    {
                        foreach (var chunk in embed)
                        {
                            openAIRequest.Messages.Add(new UserChatMessage(chunk));
                            var result = await _openAIService.GetChatResponseAsync(openAIRequest);
                            summaryResults.Add(result.ToString());
                            openAIRequest.Messages.RemoveAt(openAIRequest.Messages.Count - 1);  // Remove last chunk
                        }
                        return String.Join(" ", summaryResults);
                    }
                    else
                    {
                        openAIRequest.Messages.Add(new UserChatMessage(message));
                        var result = await _openAIService.GetChatResponseAsync(openAIRequest);
                        return result.ToString();
                    }

                case AIServiceProvider.Gemini:
                    var geminiRequest = new GeminiChatParameters
                    {
                        Contents = new List<ResponseContent>
                {
                    new ResponseContent
                    {
                        Role = "model",
                        Parts = new List<Part> { new Part { Text = systemPrompt } }
                    }
                }
                    };

                    if (isSummary && embed != null)
                    {
                        foreach (var chunk in embed)
                        {
                            geminiRequest.Contents.Add(new ResponseContent
                            {
                                Role = "user",
                                Parts = new List<Part> { new Part { Text = chunk } }
                            });
                            var result = await _geminiService.GetChatResponseAsync(geminiRequest);
                            summaryResults.Add(result.ToString());
                            geminiRequest.Contents.RemoveAt(geminiRequest.Contents.Count - 1);
                        }
                        return String.Join(" ", summaryResults);
                    }
                    else
                    {
                        geminiRequest.Contents.Add(new ResponseContent
                        {
                            Role = "user",
                            Parts = new List<Part> { new Part { Text = message } }
                        });
                        var result = await _geminiService.GetChatResponseAsync(geminiRequest);
                        return result.ToString();
                    }

                case AIServiceProvider.Groq:
                    var groqRequest = new GroqChatParameters
                    {
                        Messages = new List<Message>
                {
                    new Message { Role = "assistant", Content = systemPrompt }
                }
                    };

                    if (isSummary && embed != null)
                    {
                        foreach (var chunk in embed)
                        {
                            groqRequest.Messages.Add(new Message { Role = "user", Content = chunk });
                            var result = await _groqService.GetChatResponseAsync(groqRequest);
                            summaryResults.Add(result.ToString());
                            groqRequest.Messages.RemoveAt(groqRequest.Messages.Count - 1);
                        }
                        return String.Join(" ", summaryResults);
                    }
                    else
                    {
                        groqRequest.Messages.Add(new Message { Role = "user", Content = message });
                        var result = await _groqService.GetChatResponseAsync(groqRequest);
                        return result.ToString();
                    }

                default:
                    throw new InvalidOperationException("Unsupported AI service");
            }
        }


        public async Task LoadDocument(string document)
        {
            extractedText.Clear();
            this.DocumentContent = document;
            int chunkSize = 4000;
            int start = 0;

            while (start < document.Length)
            {
                int length = Math.Min(chunkSize, document.Length - start);
                int lastSpace = document.LastIndexOf('.', start + length - 1, length);
                if (lastSpace > start)
                {
                    string chunk = document.Substring(start, lastSpace - start);
                    extractedText.Add(chunk);
                    start = lastSpace + 1;
                }
                else
                {
                    string chunk = document.Substring(start, length);
                    extractedText.Add(chunk);
                    start += length;
                }
            }
            CreateEmbeddingChunks(extractedText.ToArray());
        }

        public async Task<string> GetDocumentSummary()
        {
            return await GetAnswerAsync("You are a helpful assistant. Your task is to analyze the provided text and generate short summary. Always respond in proper HTML format, but do not include <html>, <head>, or <body> tags.", "", true);
        }

        /// <summary>
        /// Fine closest page embedding and answer the question using GPT-4o
        /// </summary>
        /// <param name="question"></param>
        /// <returns></returns>
        public async Task<string> GetAnswer(string systemPrompt, string question)
        {
            var questionEmbedding = Embedder.Embed(question);
            var results = LocalEmbedder.FindClosest(questionEmbedding, PageEmbeddings.Select(x => (x.Key, x.Value)), 2);
            var answer = await GetAnswerAsync(systemPrompt + string.Join(" --- ", results), question);
            return answer;
        }

        /// <summary>
        /// Get the suggestions using GPT-4o and local embeddings
        /// </summary>
        /// <returns></returns>
        public async Task<string> GetSuggestions()
        {
            string text = this.DocumentContent;
            return await GetAnswerAsync("You are a helpful assistant. Your task is to analyze the provided text and generate 3 short diverse questions and each question should not exceed 10 words", text);
        }
    }

}