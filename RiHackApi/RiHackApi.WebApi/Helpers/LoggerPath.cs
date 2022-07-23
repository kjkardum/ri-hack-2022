namespace RiHackApi.WebApi.Helpers;

public class LoggerPath
{
    public IEnumerable<WriteTo>? WriteTo { get; set; }
    public string? LogPath => WriteTo?.FirstOrDefault()?.Args?.Path;
    public bool LogDefined => !string.IsNullOrWhiteSpace(LogPath);

    public bool EnsureDirectoryExists()
    {
        try
        {
            if (LogPath != null)
            {
                var logDir = new FileInfo(LogPath)?.Directory?.FullName;
                if (logDir != null)
                {
                    if (!Directory.Exists(logDir))
                        Directory.CreateDirectory(logDir);
                    return true;
                }
            }
        }
        catch
        {
        }
        return false;
    }

}

public class WriteTo
{
    public Args? Args { get; set; }
}

public class Args
{
    public string? Path { get; set; }
}