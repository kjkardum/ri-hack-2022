using System.ComponentModel.DataAnnotations;

namespace RiHackApi.Common.Requests;

public class ChangePasswordRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;

    [Required]
    public string CurrentPassword { get; set; } = null!;
        
    [Required]
    [MinLength(6)]
    public string Password { get; set; } = null!;

    [Required]
    [Compare("Password")]
    public string ConfirmPassword { get; set; } = null!;
}