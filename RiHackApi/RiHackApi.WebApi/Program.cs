using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Refit;
using RiHackApi.Business.Services;
using RiHackApi.Chatbot.Interfaces;
using RiHackApi.Common.Interfaces;
using RiHackApi.Common.Settings;
using RiHackApi.Identity.Extensions;
using RiHackApi.Identity.Seed;
using RiHackApi.Interfaces.Services;
using RiHackApi.Persistence.Contexts;
using RiHackApi.Persistence.Entities;
using RiHackApi.Persistence.Repositories;
using RiHackApi.Router.interfaces;
using RiHackApi.Shared.Services;
using RiHackApi.WebApi.Helpers;
using RiHackApi.WebApi.Services;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

var loggerPathConfig = builder.Configuration.GetSection("Serilog")
    .Get<LoggerPath>();
// Add services to the container.

if (loggerPathConfig.LogDefined && loggerPathConfig.EnsureDirectoryExists())
{
    builder.Host.UseSerilog((context, configuration) => configuration
        .ReadFrom.Configuration(context.Configuration));
}

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(o => o.AddPolicy("default", policy =>
{
    policy
        .WithOrigins(
            "http://localhost:3000",
            "https://localhost:3000",
            "https://rihack.z6.web.core.windows.net",
            "http://rihack.z6.web.core.windows.net")
        .AllowCredentials()
        .AllowAnyMethod()
        .AllowAnyHeader();
}));

builder.Services.AddIdentityInfrastructure(builder.Configuration);
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ApplicationConnection"))
);

builder.Services.AddScoped<IAuthUserService, AuthenticatedUserService>();

builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.Configure<ApplicationSettings>(builder.Configuration.GetSection("ApplicationSettings"));

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IStorageService, AzureStorageService>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(ApplicationRepository<>));

builder.Services.AddScoped<IGarbageContainerService, GarbageContainerService>();

builder.Services.AddRefitClient<IOptimizerService>()
    .ConfigureHttpClient(c =>
        c.BaseAddress =
            new Uri(builder
                        .Configuration
                        .GetSection("ApplicationSettings").Get<ApplicationSettings>().OptimizerUrl ??
                    string.Empty));

builder.Services.AddRefitClient<IChatbotService>()
    .ConfigureHttpClient(c =>
        c.BaseAddress =
            new Uri(builder
                        .Configuration
                        .GetSection("ApplicationSettings").Get<ApplicationSettings>().ChatbotUrl ??
                    string.Empty));
//you could add Polly here to handle HTTP 429 / HTTP 503 etc


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var identityDb = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await identityDb.Database.MigrateAsync();

    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
    await DefaultSuperAdmin.SeedAsync(userManager, roleManager);
}

var applicationSettings = builder.Configuration.GetSection("ApplicationSettings").Get<ApplicationSettings>();

if (applicationSettings?.UseSwagger == true)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("default");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();