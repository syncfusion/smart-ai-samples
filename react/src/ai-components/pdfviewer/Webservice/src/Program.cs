using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using EJ2APIServices.Controllers;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore;
using Syncfusion.Licensing;
using System.IO;

string _contentRootPath = "";

var builder = WebApplication.CreateBuilder(args);

if (File.Exists(Directory.GetCurrentDirectory() + "/SyncfusionLicense.txt"))
{
    string licenseKey = File.ReadAllText(Directory.GetCurrentDirectory() + "/SyncfusionLicense.txt").Trim();
    SyncfusionLicenseProvider.RegisterLicense(licenseKey);
}

var env = builder.Environment;

builder.Configuration.SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

_contentRootPath = env.ContentRootPath;
ServerPath.MapPath = _contentRootPath;

// Add services to the container.
builder.Services.AddRazorPages();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder.SetIsOriginAllowed(origin => true)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
    });
});
builder.Services.AddMemoryCache();

builder.Services.AddControllers(m => m.EnableEndpointRouting = false).AddNewtonsoftJson(x =>
{
    x.SerializerSettings.ContractResolver = null;
    x.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
    x.SerializerSettings.MissingMemberHandling = Newtonsoft.Json.MissingMemberHandling.Ignore;
    x.SerializerSettings.DateFormatHandling = Newtonsoft.Json.DateFormatHandling.MicrosoftDateFormat;
    x.SerializerSettings.DateTimeZoneHandling = Newtonsoft.Json.DateTimeZoneHandling.Utc;
});

builder.Services.AddSignalR(e =>
{
    e.MaximumReceiveMessageSize = int.MaxValue;
});

#if REDIS
        builder.Services.AddDistributedRedisCache(option => { option.Configuration = builder.Configuration["ConnectionStrings:Redis"]; });
#endif

var app = builder.Build();

app.UseCors("AllowAllOrigins");
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors();
app.UseAuthorization();
app.UseEndpoints(options =>
{
    options.MapControllers();
});
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapRazorPages();

app.Run();

public class ServerPath
{
    public static string MapPath = "";
}
