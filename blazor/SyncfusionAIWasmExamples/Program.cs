using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using SmartComponents.LocalEmbeddings;
using Syncfusion.Blazor;
using Syncfusion.Blazor.AI;
using SyncfusionAIWasmExamples;
using SyncfusionAIWasmExamples.Service;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
builder.Services.AddSyncfusionBlazor();

#region AI Integration
//builder.Services.AddScoped<FileManagerService>();

//For PDF viewer
builder.Services.AddMemoryCache();

// Local Embeddings
builder.Services.AddSingleton<LocalEmbedder>();

// OpenAI Service
builder.Services.AddSingleton(new AIServiceCredentials
{
    ApiKey = "Your API Key",
    DeploymentName = "gpt-4o-mini", // Model name (e.g., "gpt-4", "gpt-3.5-turbo")
    Endpoint = null // Must be null for OpenAI
});

builder.Services.AddSingleton<SyncfusionAIService>();
builder.Services.AddSingleton<AzureAIService>();
#endregion

await builder.Build().RunAsync();
