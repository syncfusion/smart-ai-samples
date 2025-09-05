using FileManagerAI.Services;
using Microsoft.Extensions.AI;
using OpenAI;
using SmartComponents.LocalEmbeddings;
using Syncfusion.Blazor;
using Syncfusion.Blazor.AI;
using Syncfusion.Blazor.SmartComponents;
using SyncfusionAISamples.Components;
using SyncfusionAISamples.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddSyncfusionBlazor();

#region AI Integration
builder.Services.AddScoped<FileManagerService>();

//For PDF viewer
builder.Services.AddMemoryCache();
builder.Services.AddSignalR(o => { o.MaximumReceiveMessageSize = 1024000000000; o.EnableDetailedErrors = true; });

// Local Embeddings
builder.Services.AddSingleton<LocalEmbedder>();

builder.Services.AddSyncfusionSmartComponents().InjectOpenAIInference();
// Open AI Service
string apiKey = "Api Key";
string deploymentName = "model-name";

OpenAIClient openAIClient = new OpenAIClient(apiKey);
IChatClient openAiChatClient = openAIClient.GetChatClient(deploymentName).AsIChatClient();
builder.Services.AddChatClient(openAiChatClient);

builder.Services.AddSingleton<SyncfusionAIService>();
builder.Services.AddSingleton<AzureAIService>();
#endregion

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.MapStaticAssets();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
