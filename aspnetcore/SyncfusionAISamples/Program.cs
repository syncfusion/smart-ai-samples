using Microsoft.Extensions.AI;
using OpenAI;
using OpenAI.Chat;
using Syncfusion.EJ2;
using Syncfusion.EJ2.AI;
using SyncfusionAISamples.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
# region AI Service Configuration
string openAIApiKey = "Your API Key";
string openAIModel = "Your Model Name";
OpenAIClient openAIClient = new OpenAIClient(openAIApiKey);
IChatClient openAIChatClient = openAIClient.GetChatClient(openAIModel).AsIChatClient();
builder.Services.AddChatClient(openAIChatClient);
builder.Services.AddScoped<IChatInferenceService, AIService>(sp =>
{
    return new AIService(openAIChatClient);
});
builder.Services.AddScoped<AIService>();
builder.Services.AddSyncfusionSmartComponents();
#endregion


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();
app.MapControllers();
app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.Run();
