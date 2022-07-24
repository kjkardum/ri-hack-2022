namespace RiHackApi.Domain.Dtos;

public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public List<string> Roles { get; set; }
}