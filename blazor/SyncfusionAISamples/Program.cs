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

//For PDF viewer
builder.Services.AddMemoryCache();
builder.Services.AddSignalR(o => { o.MaximumReceiveMessageSize = 1024000000000; o.EnableDetailedErrors = true; });

// Local Embeddings
builder.Services.AddSingleton<LocalEmbedder>();

// OpenAI Service
string apiKey = "your-api-key";
string deploymentName = "your-deployment-name";
// your-azure-endpoint-url
string endpoint = "";

//Injecting smart components
builder.Services.AddSyncfusionSmartComponents()
    .ConfigureCredentials(new AIServiceCredentials(apiKey, deploymentName, endpoint)) //Configuring credentials for AI functionality to work
    .InjectOpenAIInference(); // Injecting OpenAI Services

builder.Services.AddSingleton<OpenAIConfiguration>();
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

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
