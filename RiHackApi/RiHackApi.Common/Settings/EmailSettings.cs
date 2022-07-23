namespace RiHackApi.Common.Settings;

public class EmailSettings
{
    public string From { get; set; } = null!;
    public string SendGridApiKey { get; set; } = null!;
    public string FromName { get; set; } = null!;   
}