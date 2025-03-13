using Azure.AI.OpenAI;
using Microsoft.Extensions.AI;
using Microsoft.JSInterop;
using OpenAI;
using Syncfusion.Blazor.SmartComponents;
using SyncfusionAISamples.Service;
using System.ClientModel;

namespace SyncfusionAISamples.Components.Service
{
    public class CustomInferenceBackend : IInferenceBackend
    {
        private IChatClient client;
        private readonly UserTokenService _userTokenService;
        public CustomInferenceBackend(UserTokenService userTokenService)
        {
            string apiKey = "your-api-key";
            string deploymentName = "your-deployment-name";
            // your-azure-endpoint-url
            string endpoint = "";
            client = new AzureOpenAIClient(new Uri(endpoint), new ApiKeyCredential(apiKey)).AsChatClient(deploymentName);
            _userTokenService = userTokenService;
        }

        public async Task<string> GetChatResponseAsync(ChatParameters options)
        {
            //string userCode = await _userTokenService.GetUserFingerprintAsync();
            //int remainingTokens = await _userTokenService.GetRemainingTokensAsync(userCode);

            //if (remainingTokens <= 0)
            //{
            //    await _userTokenService.ShowAlert();
            //    return string.Empty;
            //}
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
                ChatCompletion completion = await client.CompleteAsync(options.Messages, completionRequest);
                //await _userTokenService.UpdateTokensAsync(userCode, (int)(remainingTokens - completion.Usage.TotalTokenCount));
                return completion.Message.Text;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
