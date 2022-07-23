using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using RiHackApi.Common.Constants;
using RiHackApi.Common.Interfaces;
using RiHackApi.Common.Requests;
using RiHackApi.Common.Responses;
using RiHackApi.Common.Settings;
using RiHackApi.Common.Wrappers;
using RiHackApi.Persistence.Contexts;
using RiHackApi.Persistence.Entities;

namespace RiHackApi.Identity.Services;

public class AccountService : IAccountService
{
    private readonly ApplicationSettings _applicationSettings;
    private readonly ApplicationDbContext _dbContext;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly SignInManager<User> _signInManager;
    private readonly JwtSettings _jwtSettings;

    public AccountService(
        IOptions<JwtSettings> jwtSettings,
        IOptions<ApplicationSettings> applicationSettings,
        ApplicationDbContext dbContext,
        UserManager<User> userManager,
        RoleManager<IdentityRole<Guid>> roleManager,
        SignInManager<User> signInManager)
    {
        _applicationSettings = applicationSettings.Value;
        _dbContext = dbContext;
        _userManager = userManager;
        _roleManager = roleManager;
        _signInManager = signInManager;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<Response<LoginResponse>> Login(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null) return new Response<LoginResponse>("User not found");
        
        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded) return new Response<LoginResponse>("Invalid password");

        var jwt = await GenerateJwToken(user);
        var token = new JwtSecurityTokenHandler().WriteToken(jwt);

        return new Response<LoginResponse>(new LoginResponse
        {
            Id = user.Id,
            Email = user.Email,
            JWToken = token
        }, null);
    }

    private async Task<SecurityToken> GenerateJwToken(User user)
    {
        var userClaims = await _userManager.GetClaimsAsync(user);
        var roles = await _userManager.GetRolesAsync(user);

        var roleClaims = roles.Select(t => new Claim(ClaimTypes.Role, t)).ToList();

        var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("uid", user.Id.ToString()),
            }
            .Union(userClaims)
            .Union(roleClaims);

        var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
        var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

        return new JwtSecurityToken(
            _jwtSettings.Issuer,
            _jwtSettings.Audience,
            claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.DurationInMinutes),
            signingCredentials: signingCredentials);
    }

    public async Task<Response<Guid>> RegisterUser(RegistrationRequest request)
    {
        var userWithSameEmail = await _userManager.FindByEmailAsync(request.Email);
        if (userWithSameEmail != null) return new Response<Guid>("User with this email already exists");

        var user = new User
        {
            UserName = request.Email,
            Email = request.Email,
        };
        var result = await _userManager.CreateAsync(user, request.Password);
        return result.Succeeded ? 
            new Response<Guid>(user.Id, null) : 
            new Response<Guid>($"Failed to register user, errors: {result.Errors}");
    }

    public async Task<Response<string>> ChangePassword(ChangePasswordRequest request)
    {
        var account = await _userManager.FindByEmailAsync(request.Email);
        if (account == null)
            return new Response<string>("User not found");
        var result = await _userManager.ChangePasswordAsync(account, request.CurrentPassword, request.Password);
        return !result.Succeeded ?
            new Response<string>(string.Join('\n', result.Errors.Select(e => e.Description).ToList())) :
            new Response<string>("Success", null);
    }

    public async Task<Response<string>> ForgotPassword(ForgotPasswordRequest model)
    {
        var account = await _userManager.FindByEmailAsync(model.Email);
        if (account == null) return new Response<string>("User not found");

        var code = await _userManager.GeneratePasswordResetTokenAsync(account);
        const string route = "account/resetPassword";
        var endpointUri = new Uri(string.Concat($"{_applicationSettings.FrontendUrl}/", route));
        var passwordResetLink = string.Concat(endpointUri, "?userId=", account.Id, "&token=", code);
        //await _emailService.SendPasswordRequestUrl(passwordResetLink, account.Id);
        return new Response<string>("Success", null);
    }

    public async Task<Response<string>> ResetPassword(ResetPasswordRequest model)
    {
        model.Token = model.Token.Replace(" ", "+");
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null) return new Response<string>("User not found");
        var result = await _userManager.ResetPasswordAsync(user, model.Token, model.Password);
        
        if (!result.Succeeded) return new Response<string>(string.Join(", ", result.Errors.Select(e => e.Description)));
        
        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();
        return new Response<string>("Successfully changed password", null);
    }
    public async Task<bool> CheckEmailTaken(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        return user != null;
    }

    public async Task SetAsAdmin(Guid userId)
    {
        var account = await _dbContext.Users.FirstAsync(u => u.Id == userId);
        await _userManager.AddToRoleAsync(account, BaseRoles.Admin);
    }

    public async Task RevokeAdmin(Guid userId)
    {
        var account = await _dbContext.Users.FirstAsync(u => u.Id == userId);
        await _userManager.RemoveFromRoleAsync(account, BaseRoles.Admin);
    }
}