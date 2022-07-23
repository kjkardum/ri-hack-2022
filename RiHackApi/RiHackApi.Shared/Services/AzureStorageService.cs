using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Azure.Storage.Sas;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using RiHackApi.Common.Interfaces;
using RiHackApi.Common.Responses;
using RiHackApi.Common.Settings;

namespace RiHackApi.Shared.Services;

public class AzureStorageService : IStorageService
{
    private readonly ApplicationSettings _applicationSettings;
    private readonly string _connectionString;
    private const string ContainerName = "file-storage";

    public AzureStorageService(IConfiguration configuration, IOptions<ApplicationSettings> applicationSettings)
    {
        _applicationSettings = applicationSettings.Value;
        _connectionString = configuration.GetConnectionString("AzureStorage");
    }

    private async Task<BlobContainerClient> ConnectAsync()
    {
        var container = new BlobContainerClient(_connectionString, ContainerName);
        var createResponse = await container.CreateIfNotExistsAsync();
        if (createResponse != null && createResponse.GetRawResponse().Status == 201)
            await container.SetAccessPolicyAsync();
        return container;
    }
    public async Task<string> CreateAsync(Stream fileStream, string folder, string filename, string contentType)
    {
        var fileExtension = Path.GetExtension(filename);
        var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(filename);
        var domain = _applicationSettings.FrontendUrl?.Split('/')[2].Replace(".", "_").Split('/')[0] ?? "unknown";
        var fileName = $"app-{domain}/{folder}/{fileNameWithoutExtension.Replace('/','_')}--{DateTime.UtcNow.ToString("dd-MMMM-yyyy_HH_m_s")}{fileExtension}";
        var container = await ConnectAsync();
        var blob = container.GetBlobClient(fileName);
        
        await blob.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
        
        await blob.UploadAsync(fileStream, new BlobHttpHeaders {ContentType = contentType});
        return blob.Uri.ToString();
    }

    public async Task<FileDownloadResponse> Get(string filePath)
    {
        var container = await ConnectAsync();
        var name = filePath.Replace(container.Uri.ToString(), "");
        var blob = container.GetBlobClient(name);
        var stream = await blob.OpenReadAsync();
        
        var fileName = name.Split('/').Last();
        var fileExtension = Path.GetExtension(fileName);
        var fileNameWithoutDate = fileName.Split("--");
        var finalName = string.Join("", fileNameWithoutDate.Take(fileNameWithoutDate.Length - 1)) + fileExtension;
        return new FileDownloadResponse
        {
            FileStream = stream,
            FileName = finalName,
            ContentType = (await blob.GetPropertiesAsync()).Value.ContentType
        };
    }

    public async Task<Uri> GetPublicUrl(string filePath)
    {
        var container = await ConnectAsync();
        var name = filePath.Replace(container.Uri.ToString(), "");
        var blob = container.GetBlobClient(name);
        return GetServiceSasUriForBlob(blob);
    }

    private static Uri GetServiceSasUriForBlob(BlobBaseClient blobClient, string? storedPolicyName = null)
    {
        if (!blobClient.CanGenerateSasUri) return new Uri("");
        var sasBuilder = new BlobSasBuilder()
        {
            BlobContainerName = blobClient.GetParentBlobContainerClient().Name,
            BlobName = blobClient.Name,
            Resource = "b"
        };
        if (storedPolicyName == null)
        {
            sasBuilder.ExpiresOn = DateTimeOffset.UtcNow.AddHours(1);
            sasBuilder.SetPermissions(BlobSasPermissions.Read);
        }
        else
        {
            sasBuilder.Identifier = storedPolicyName;
        }
        var sasUri = blobClient.GenerateSasUri(sasBuilder);
        return sasUri;
    }
    
    public async Task Remove(string filePath)
    {
        var container = await ConnectAsync();
        var name = filePath.Replace(container.Uri.ToString(), "");
        var blob = container.GetBlobClient(name);
        await blob.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
    }
}