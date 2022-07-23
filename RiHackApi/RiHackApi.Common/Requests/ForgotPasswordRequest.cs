using System.ComponentModel.DataAnnotations;

namespace RiHackApi.Common.Requests;

public class ForgotPasswordRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;
}