using FileManagerAI.Services;
using SmartComponents.LocalEmbeddings;
using Syncfusion.Blazor;
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
builder.Services.AddScoped<DocumentSummarizerService>();

//For PDF viewer
builder.Services.AddMemoryCache();
builder.Services.AddSignalR(o => { o.MaximumReceiveMessageSize = 1024000000000; o.EnableDetailedErrors = true; });

// Local Embeddings
builder.Services.AddSingleton<LocalEmbedder>();

/* OpenAI Service */
//string apiKey = "<OPENAI_API_KEY>";
//string deploymentName = "<OPENAI_DEPLOYMENT_NAME>";
//string endpoint = "<OPENAI_ENDPOINT>";
//var creds = new AIServiceCredentials(apiKey, deploymentName, AIServiceProvider.AzureOpenAI, endpoint);

/* Gemini Service */
//string apiKey = "<GEMINI_API_KEY>";
//string deploymentName = "<GEMINI_DEPLOYMENT_NAME>";
//var creds = new AIServiceCredentials(apiKey, deploymentName, AIServiceProvider.Gemini);

/* Groq Service */
//string apiKey = "<GROQ_API_KEY>";
//string deploymentName = "<GROQ_DEPLOYMENT_NAME>";
//var creds = new AIServiceCredentials(apiKey, deploymentName, AIServiceProvider.Groq);

/* Cohere Service */
//string apiKey = "<COHERE_API_KEY>";
//string deploymentName = "<COHERE_DEPLOYMENT_NAME>";
//var creds = new AIServiceCredentials(apiKey, deploymentName, AIServiceProvider.Cohere);

/* Together Service */
// string apiKey = "<TOGETHER_API_KEY>";
// string deploymentName = "<TOGETHER_DEPLOYMENT_NAME>";
// var creds = new AIServiceCredentials(apiKey, deploymentName, AIServiceProvider.Together);

builder.Services.AddSyncfusionSmartComponents().ConfigureCredentials(creds);

builder.Services.AddScoped<AIService>();

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

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
