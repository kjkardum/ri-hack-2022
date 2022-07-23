using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RiHackApi.Common.Constants;
using RiHackApi.Persistence.Entities;

namespace RiHackApi.Identity.Seed;

public static class DefaultSuperAdmin
{
    public static async Task SeedAsync(UserManager<User> userManager, RoleManager<IdentityRole<Guid>> roleManager)
    {
        if (await userManager.Users.AnyAsync())
        {
            return;
        }

        var user = new User
        {
            UserName = "superadmin@hahafer.com",
            Email = "superadmin@hahafer.com",
            EmailConfirmed = true,
        };
        await roleManager.CreateAsync(new IdentityRole<Guid>(BaseRoles.SuperAdmin));
        await roleManager.CreateAsync(new IdentityRole<Guid>(BaseRoles.Admin));
        await userManager.AddPasswordAsync(user, "Pa$$w0rd");
        await userManager.CreateAsync(user, "Pa$$w0rd");
        await userManager.AddToRoleAsync(user, BaseRoles.SuperAdmin);
    }
}