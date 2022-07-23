using System.ComponentModel.DataAnnotations;

namespace RiHackApi.Common.Requests;

public class RegistrationRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    [MinLength(8)]
    public string Password { get; set; } = null!;
    
    [Required]
    [Compare("Password")]
    public string ConfirmPassword { get; set; } = null!;
}