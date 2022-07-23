namespace RiHackApi.Common.Responses;

public class LoginResponse
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public string JWToken { get; set; } = null!;
}