using RiHackApi.Common.Responses;

namespace RiHackApi.Common.Interfaces;

public interface IStorageService
{
    Task<string> CreateAsync(Stream fileStream, string folder, string filename, string contentType);
    Task<FileDownloadResponse> Get(string filePath);
    Task<Uri> GetPublicUrl(string filePath);
    Task Remove(string filePath);
}