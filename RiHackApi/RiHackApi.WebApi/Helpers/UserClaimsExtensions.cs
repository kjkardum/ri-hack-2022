using System.Security.Claims;

namespace RiHackApi.WebApi.Helpers;

public static class UserClaimsExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirstValue("uid");
        return Guid.TryParse(value, out var userId) ? userId : Guid.Empty;
    }
}