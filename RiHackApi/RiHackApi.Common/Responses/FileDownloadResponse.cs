namespace RiHackApi.Common.Responses;

public class FileDownloadResponse
{
    public Stream FileStream { get; set; }
    public string FileName { get; set; }
    public string ContentType { get; set; }
}