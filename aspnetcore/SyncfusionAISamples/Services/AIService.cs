using Microsoft.Extensions.AI;
using Syncfusion.EJ2.AI;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;

namespace SyncfusionAISamples.Services
{

    public class AIService : IChatInferenceService
    {
        private ChatParameters chatParameters_history = new ChatParameters();
        private IChatClient _chatClient;

        public AIService(IChatClient client)
        {
            this._chatClient = client ?? throw new ArgumentNullException(nameof(client));
        }


        /// <summary>
        /// Gets a text completion from the Azure OpenAI service.
        /// </summary>
        /// <param name="prompt">The user prompt to send to the AI service.</param>
        /// <param name="returnAsJson">Indicates whether the response should be returned in JSON format. Defaults to <c>true</c></param>
        /// <param name="appendPreviousResponse">Indicates whether to append previous responses to the conversation history. Defaults to <c>false</c></param>
        /// <param name="systemRole">Specifies the systemRole that is sent to AI Clients. Defaults to <c>null</c></param>
        /// <returns>The AI-generated completion as a string.</returns>
        public async Task<string> GetCompletionAsync(string prompt, bool returnAsJson = true, bool appendPreviousResponse = false, string systemRole = null, int outputTokens = 2000)
        {
            string systemMessage = returnAsJson ? "You are a helpful assistant that only returns and replies with valid, iterable RFC8259 compliant JSON in your responses unless I ask for any other format. Do not provide introductory words such as 'Here is your result' or '```json', etc. in the response" : !string.IsNullOrEmpty(systemRole) ? systemRole : "You are a helpful assistant";
            try
            {
                ChatParameters chatParameters = appendPreviousResponse ? chatParameters_history : new ChatParameters();
                if (appendPreviousResponse)
                {
                    if (chatParameters.Messages == null)
                    {
                        chatParameters.Messages = new List<ChatMessage>() {
                        new ChatMessage(ChatRole.System,systemMessage),
                    };
                    }
                    chatParameters.Messages.Add(new ChatMessage(ChatRole.User, prompt));
                }
                else
                {
                    chatParameters.Messages = new List<ChatMessage>(2) {
                    new ChatMessage (ChatRole.System, systemMessage),
                    new ChatMessage(ChatRole.User,prompt),
                };
                }
                chatParameters.MaxTokens = outputTokens;
                var completion = await GenerateResponseAsync(chatParameters);
                if (appendPreviousResponse)
                {
                    chatParameters_history?.Messages?.Add(new ChatMessage(ChatRole.Assistant, completion));
                }
                return completion;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An exception has occurred: {ex.Message}");
                return "";
            }
        }
        public async Task<string> GenerateResponseAsync(ChatParameters options)
        {
            // Create a completion request with the provided parameters
            var completionRequest = new ChatOptions
            {
                Temperature = options.Temperature ?? 0.5f,
                TopP = options.TopP ?? 1.0f,
                MaxOutputTokens = options.MaxTokens ?? 2000,
                FrequencyPenalty = options.FrequencyPenalty ?? 0.0f,
                PresencePenalty = options.PresencePenalty ?? 0.0f,
                StopSequences = options.StopSequences
            };
            try
            {
                ChatResponse completion = await _chatClient.GetResponseAsync(options.Messages, completionRequest);
                return completion.Text.ToString();
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task StreamAsync([FromBody] ChatRequest request, HttpContext httpContext)
        {
            var response = httpContext.Response;

            if (string.IsNullOrWhiteSpace(request?.Message))
            {
                response.StatusCode = StatusCodes.Status400BadRequest;
                await response.WriteAsync("Message cannot be empty.");
                return;
            }

            response.ContentType = "text/plain";
            try
            {
                var userId = httpContext.Request.Headers["Authentication"].ToString();

                int tokensUsed = 0;

                await foreach (var chunk in StreamCompletionAsync(
                    prompt: request.Message,
                    appendPreviousResponse: true,
                    systemRole: null,
                    returnAsJson: false,
                    cancellationToken: httpContext.RequestAborted))
                {
                    tokensUsed += chunk.Length / 4;
                    await response.WriteAsync(chunk);
                    await response.Body.FlushAsync();
                }
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("Insufficient tokens"))
            {
                response.StatusCode = StatusCodes.Status402PaymentRequired;
                await response.WriteAsync("Insufficient tokens to process the request.");
            }
            catch (OperationCanceledException)
            {
                // client canceled
            }
        }

        public async IAsyncEnumerable<string> StreamCompletionAsync(
            string prompt,
            bool appendPreviousResponse = false,
            string systemRole = null,
            bool returnAsJson = true,
            CancellationToken cancellationToken = default)
        {
            string systemMessage = returnAsJson ? "You are a helpful assistant that only returns and replies with valid, iterable RFC8259 compliant JSON in your responses unless I ask for any other format. Do not provide introductory words such as 'Here is your result' or '```json', etc. in the response" : !string.IsNullOrEmpty(systemRole) ? systemRole : "You are a helpful assistant";
            ChatParameters chatParameters = appendPreviousResponse ? chatParameters_history : new ChatParameters();
            if (appendPreviousResponse)
            {
                if (chatParameters.Messages == null)
                {
                    chatParameters.Messages = new List<ChatMessage>() {
                        new ChatMessage(ChatRole.System, systemMessage),
                    };
                }
                chatParameters.Messages.Add(new ChatMessage(ChatRole.User, prompt));
            }
            else
            {
                chatParameters.Messages = new List<ChatMessage>(2) {
                    new ChatMessage(ChatRole.System, systemMessage),
                    new ChatMessage(ChatRole.User, prompt),
                };
            }
            var completionRequest = new ChatOptions
            {
                Temperature = 0.5f,
                TopP = 1.0f,
                MaxOutputTokens = 2000,
            };
            await foreach (var chunk in _chatClient.GetStreamingResponseAsync(
                chatParameters.Messages,
                completionRequest,
                cancellationToken))
            {
                yield return chunk.Text;
            }
        }
    }

    public class ChatRequest
    {
        public string Message { get; set; }
    }
}
