using OpenAI.Chat;
using Syncfusion.Blazor.SmartComponents;

namespace SyncfusionAISamples.Service
{
    public class AIService
    {
        private IAIService _activeServiceProvider;
        private AIServiceCredentials _credentials;

        private OpenAIChatParameters _openAIChatHistory = new OpenAIChatParameters();
        private GeminiChatParameters _geminiChatHistory = new GeminiChatParameters();
        private GroqChatParameters _groqChatHistory = new GroqChatParameters();
        private FireworksChatParameters _fireworksChatHistory = new FireworksChatParameters();

        private CohereChatParameters cohereChatParameters = new CohereChatParameters();

        public AIService(IServiceProvider service)
        {
            _activeServiceProvider = service.GetService<IAIService>();
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
                    case AIServiceProvider.Cohere:
                        response = await GetCohereCompletionAsync(prompt, systemMessage, appendPreviousResponse);
                        break;
                    case AIServiceProvider.Fireworks:
                        response = await GetFireworksCompletionAsync(prompt, systemMessage, appendPreviousResponse);
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
            OpenAIChatParameters openAIChatParameters = appendPreviousResponse ? _openAIChatHistory : new OpenAIChatParameters();
            if (appendPreviousResponse)
            {
                if (openAIChatParameters.Messages == null)
                {
                    openAIChatParameters.Messages = new List<ChatMessage>() {
                        new SystemChatMessage(systemMessage),
                        };
                }
                openAIChatParameters.Messages.Add(new UserChatMessage(prompt));
            }
            else
            {
                openAIChatParameters.Messages = new List<ChatMessage>(2) {
                    new SystemChatMessage(systemMessage),
                    new UserChatMessage(prompt)
                    };
            }
            var completion = await _activeServiceProvider.GetChatResponseAsync(openAIChatParameters);
            if (appendPreviousResponse)
            {
                _openAIChatHistory?.Messages?.RemoveAt(_openAIChatHistory.Messages.Count - 1);
                _openAIChatHistory?.Messages?.Add(new AssistantChatMessage(completion.ToString()));
            }
            return completion;
        }

        private async Task<string> GetGeminiCompletionAsync(string prompt, string systemMessage, bool appendPreviousResponse = false)
        {

            GeminiChatParameters geminiChatParameters = appendPreviousResponse ? _geminiChatHistory : new GeminiChatParameters();
            if (appendPreviousResponse)
            {
                if (geminiChatParameters.Contents == null)
                {
                    geminiChatParameters.Contents = new List<ResponseContent>
                    {
                        new ResponseContent
                        {
                            Role = "model",
                            Parts = new List<Part>
                            {
                                new Part{ Text = systemMessage }
                            }
                        }
                    };
                }
                geminiChatParameters.Contents.Add(new ResponseContent(prompt, "user"));
            }
            else
            {
                geminiChatParameters.Contents = new List<ResponseContent>
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
            var completion = await _activeServiceProvider.GetChatResponseAsync(geminiChatParameters);
            if (appendPreviousResponse)
            {
                _geminiChatHistory?.Contents?.RemoveAt(_geminiChatHistory.Contents.Count - 1);
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

            GroqChatParameters groqChatParameters = appendPreviousResponse ? _groqChatHistory : new GroqChatParameters();
            if (appendPreviousResponse)
            {
                if (groqChatParameters.Messages == null)
                {
                    groqChatParameters.Messages = new List<Message>
                    {
                        new Message
                        {
                            Role = "assistant",
                            Content = systemMessage
                        }
                    };
                }
                groqChatParameters.Messages.Add(new Message
                {
                    Role = "user",
                    Content = prompt
                });
            }
            else
            {
                groqChatParameters.Messages = new List<Message>
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
            var completion = await _activeServiceProvider.GetChatResponseAsync(groqChatParameters);
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

        private async Task<string> GetCohereCompletionAsync(string prompt, string systemMessage, bool appendPreviousResponse = false)
        {
            if (appendPreviousResponse)
            {
                if (cohereChatParameters.SystemMessage == null)
                {
                    cohereChatParameters.SystemMessage = systemMessage;
                }
                cohereChatParameters.UserMessage = prompt;
            }
            else
            {
                cohereChatParameters.SystemMessage = systemMessage;
                cohereChatParameters.UserMessage = prompt;
                cohereChatParameters.ChatHistory = null;
            }
            var completion = await _activeServiceProvider.GetChatResponseAsync(cohereChatParameters);
            if (appendPreviousResponse)
            {
                if (cohereChatParameters.ChatHistory == null)
                {
                    cohereChatParameters.ChatHistory = new List<CohereChatHistory>();
                }

                cohereChatParameters.ChatHistory.Add(new CohereChatHistory
                {
                    Role = CohereRoleEnum.CHATBOT,
                    Message = completion.ToString()
                });
            }
            return completion;
        }

        private async Task<string> GetFireworksCompletionAsync(string prompt, string systemMessage, bool appendPreviousResponse = false)
        {

            FireworksChatParameters fireworksChatParameters = appendPreviousResponse ? _fireworksChatHistory : new FireworksChatParameters();
            if (appendPreviousResponse)
            {
                if (fireworksChatParameters.Messages == null)
                {
                    fireworksChatParameters.Messages = new List<Message>
                    {
                        new Message
                        {
                            Role = "system",
                            Content = systemMessage
                        }
                    };
                }
                fireworksChatParameters.Messages.Add(new Message
                {
                    Role = "user",
                    Content = prompt
                });
            }
            else
            {
                fireworksChatParameters.Messages = new List<Message>
                {
                    new Message
                    {
                        Role = "system",
                        Content = systemMessage
                    },
                    new Message
                    {
                        Role = "user",
                        Content = prompt
                    }
                };
            }
            var completion = await _activeServiceProvider.GetChatResponseAsync(fireworksChatParameters);
            if (appendPreviousResponse)
            {
                _fireworksChatHistory?.Messages?.RemoveAt(_fireworksChatHistory.Messages.Count - 1);
                _fireworksChatHistory?.Messages?.Add(new Message
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
