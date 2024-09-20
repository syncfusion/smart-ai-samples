using OpenAI.Chat;
using Syncfusion.Blazor.SmartComponents;

namespace SyncfusionAISamples.Service
{
    public class AIService
    {
        private readonly GeminiService _geminiService;
        private readonly OpenAIService _openAIService;
        private readonly GroqService _groqService;
        private AIServiceCredentials _credentials;

        private OpenAIRequestObject _openAIChatHistory = new OpenAIRequestObject();
        private GeminiRequestObject _geminiChatHistory = new GeminiRequestObject();
        private GroqRequestObject _groqChatHistory = new GroqRequestObject();

        public AIService(IServiceProvider service)
        {
            _openAIService = service.GetService<OpenAIService>();
            _geminiService = service.GetService<GeminiService>();
            _groqService = service.GetService<GroqService>();
            _credentials = service.GetService<AIServiceCredentials>();
        }

        /// <summary>
        /// Gets a text completion from the Azure OpenAI service.
        /// </summary>
        /// <param name="prompt">The user prompt to send to the AI service.</param>
        /// <param name="returnAsJson">Indicates whether the response should be returned in JSON format.</param>
        /// <param name="appendPreviousResponse">Indicates whether to append previous responses to the conversation history.</param>
        /// <returns>The AI-generated completion as a string.</returns>
        public async Task<string> GetCompletionAsync(string prompt, bool returnAsJson = true, bool appendPreviousResponse = false, string systemRole = null)
        {
            string systemMessage = GetSystemMessage(returnAsJson, systemRole);
            try
            {
                string response = string.Empty;
                switch (_credentials.AIService)
                {
                    case AIServiceProvider.OpenAI:
                    case AIServiceProvider.AzureOpenAI:
                        response = await GetOpenAICompletionAsync(prompt, systemMessage, appendPreviousResponse);
                        break;

                    case AIServiceProvider.Gemini:
                        response = await GetGeminiCompletionAsync(prompt, systemMessage, appendPreviousResponse);
                        break;

                    case AIServiceProvider.Groq:
                        response = await GetGroqCompletionAsync(prompt, systemMessage, appendPreviousResponse);
                        break;

                    default:
                        throw new InvalidOperationException("Unsupported AI service");
                }
                if(returnAsJson)
                {
                    if (response.StartsWith("```json"))
                    {
                        response = response.Replace("```json", "").Replace("```", "").Trim();
                    }
                    else if (response.StartsWith("```"))
                    {
                        response = response.Replace("```", "").Replace("```", "").Trim();
                    }
                }
                return response.ToString();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An exception has occurred: {ex.Message}");
                return "";
            }
        }

        private async Task<string> GetOpenAICompletionAsync(string prompt, string systemMessage, bool appendPreviousResponse = false)
        {

            OpenAIRequestObject openAIRequestObj = appendPreviousResponse ? _openAIChatHistory : new OpenAIRequestObject();
            if (appendPreviousResponse)
            {
                if (openAIRequestObj.Messages == null)
                {
                    openAIRequestObj.Messages = new List<ChatMessage>() {
                        new SystemChatMessage(systemMessage),
                        };
                }
                openAIRequestObj.Messages.Add(new UserChatMessage(prompt));
            }
            else
            {
                openAIRequestObj.Messages = new List<ChatMessage>(2) {
                    new SystemChatMessage(systemMessage),
                    new UserChatMessage(prompt)
                    };
            }
            var completion = await _openAIService.GetChatResponseAsync(openAIRequestObj);
            if (appendPreviousResponse)
            {
                _openAIChatHistory?.Messages?.Add(new AssistantChatMessage(completion.ToString()));
            }
            return completion;
        }

        private async Task<string> GetGeminiCompletionAsync(string prompt, string systemMessage, bool appendPreviousResponse = false)
        {

            GeminiRequestObject geminiRequestObj = appendPreviousResponse ? _geminiChatHistory : new GeminiRequestObject();
            if (appendPreviousResponse)
            {
                geminiRequestObj.Contents = new List<ResponseContent>
                {
                    new ResponseContent
                    {
                        Role = "model",
                        Parts = new List<Part>
                        {
                            new Part{ Text = systemMessage }
                        }
                    },
                    new ResponseContent
                    {
                        Role = "user",
                        Parts = new List<Part>
                        {
                            new Part{ Text = prompt }
                        }
                    }
                };
            }
            else
            {
                geminiRequestObj.Contents = new List<ResponseContent>
                {
                    new ResponseContent
                    {
                        Role = "model",
                        Parts = new List<Part>
                        {
                            new Part{ Text = systemMessage }
                        }
                    },
                    new ResponseContent
                    {
                        Role = "user",
                        Parts = new List<Part>
                        {
                            new Part{ Text = prompt }
                        }
                    }
                };
            }
            var completion = await _geminiService.GetChatResponseAsync(geminiRequestObj);
            if (appendPreviousResponse)
            {
                _geminiChatHistory?.Contents.Add(new ResponseContent
                {
                    Role = "model",
                    Parts = new List<Part>
                        {
                            new Part{ Text = completion.ToString() }
                        }
                });
            }
            return completion;
        }

        private async Task<string> GetGroqCompletionAsync(string prompt, string systemMessage, bool appendPreviousResponse = false)
        {

            GroqRequestObject groqRequestObj = appendPreviousResponse ? _groqChatHistory : new GroqRequestObject();
            if (appendPreviousResponse)
            {
                if (groqRequestObj.Messages == null)
                {
                    groqRequestObj.Messages = new List<Message>
                    {
                        new Message
                        {
                            Role = "assistant",
                            Content = systemMessage
                        }
                    };
                }
                groqRequestObj.Messages.Add(new Message
                {
                    Role = "user",
                    Content = prompt
                });
            }
            else
            {
                groqRequestObj.Messages = new List<Message>
                {
                    new Message
                    {
                        Role = "assistant",
                        Content = systemMessage
                    },
                    new Message
                    {
                        Role = "user",
                        Content = prompt
                    }
                };
            }
            var completion = await _groqService.GetChatResponseAsync(groqRequestObj);
            if (appendPreviousResponse)
            {
                _groqChatHistory?.Messages?.RemoveAt(_groqChatHistory.Messages.Count - 1);
                _groqChatHistory?.Messages?.Add(new Message
                {
                    Role = "assistant",
                    Content = completion.ToString()
                });
            }
            return completion;
        }

        private string GetSystemMessage(bool returnAsJson, string systemRole)
        {
            if (returnAsJson)
            {
                return "You are a helpful assistant that only returns and replies with valid, iterable RFC8259 compliant JSON in your responses unless I ask for any other format. Do not provide introductory words such as 'Here is your result' or '```json', etc. in the response";
            }

            return !string.IsNullOrEmpty(systemRole) ? systemRole : "You are a helpful assistant";
        }
    }
}
