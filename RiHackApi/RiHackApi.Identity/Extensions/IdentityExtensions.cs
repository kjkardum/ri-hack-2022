using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using RiHackApi.Common.Constants;
using RiHackApi.Common.Interfaces;
using RiHackApi.Common.Settings;
using RiHackApi.Common.Wrappers;
using RiHackApi.Identity.Services;
using RiHackApi.Persistence.Contexts;
using RiHackApi.Persistence.Entities;

namespace RiHackApi.Identity.Extensions;

public static class IdentityExtensions
{
    public static void AddIdentityInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddIdentity<User, IdentityRole<Guid>>(o =>
            {
                o.Password.RequireDigit = true;
                o.Password.RequireLowercase = false;
                o.Password.RequireUppercase = false;
                o.Password.RequireNonAlphanumeric = false;
                o.Password.RequiredLength = 8;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        services.Configure<JwtSettings>(t => configuration.GetSection("JWTSettings").Bind(t));

        services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(opt =>
            {
                opt.RequireHttpsMetadata = false;
                opt.SaveToken = false;
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,
                    ValidIssuer = configuration["JWTSettings:Issuer"],
                    ValidAudience = configuration["JWTSettings:Audience"],
                    IssuerSigningKey =
                        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWTSettings:Key"]))
                };
                opt.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        context.NoResult();
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        context.Response.ContentType = "text/plain";
                        return context.Response.WriteAsync(context.Exception.ToString());
                    },
                    OnChallenge = context =>
                    {
                        context.HandleResponse();
                        if (context.Response.HasStarted) return context.Response.WriteAsync("Unauthorized");
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        context.Response.ContentType = "application/json";
                        var result = JsonConvert.SerializeObject(
                            new Response<string>("Unauthorized")
                        );
                        return context.Response.WriteAsync(result);
                    },
                    OnForbidden = context =>
                    {
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        context.Response.ContentType = "application/json";
                        var result = JsonConvert.SerializeObject(
                            new Response<string>("Forbidden")
                        );
                        return context.Response.WriteAsync(result);
                    }
                };
            });
        services.AddAuthorization(opt =>
        {
            opt.AddPolicy(Policies.RequireSuperAdmin, policy => policy.RequireRole(BaseRoles.SuperAdmin));
            opt.AddPolicy(Policies.RequireAdmin, policy => policy.RequireRole(BaseRoles.Admin));
        });
        services.AddScoped<IAccountService, AccountService>();

    }
}