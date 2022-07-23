using System.Security.Claims;
using RiHackApi.Common.Interfaces;

namespace RiHackApi.WebApi.Services;

public class AuthenticatedUserService : IAuthUserService
{
    public Guid UserId { get; }
    public AuthenticatedUserService(IHttpContextAccessor httpContextAccessor)
    {
        if (!Guid.TryParse(httpContextAccessor.HttpContext?.User.FindFirstValue("uid") ?? string.Empty, out var userId))
            UserId = userId;
    }
}