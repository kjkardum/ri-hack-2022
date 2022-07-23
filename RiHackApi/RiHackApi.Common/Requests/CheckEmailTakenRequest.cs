using System.ComponentModel.DataAnnotations;

namespace RiHackApi.Common.Requests;

public class CheckEmailTakenRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = null!;
}