using Azure.Storage.Blobs;
using AIArtGallery.Api.Options;
using Microsoft.Extensions.Options;

namespace AIArtGallery.Api.Services;

public class AzureBlobStorageService(IOptions<AzureStorageOptions> options)
{
  private readonly AzureStorageOptions _storageOptions = options.Value;

  public async Task<string> UploadAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default)
  {
    var container = new BlobContainerClient(_storageOptions.ConnectionString, _storageOptions.ContainerName);
    await container.CreateIfNotExistsAsync(cancellationToken: cancellationToken);

    var safeFileName = $"{DateTime.UtcNow:yyyyMMddHHmmssfff}-{Guid.NewGuid():N}-{fileName}";
    var blob = container.GetBlobClient(safeFileName);

    await blob.UploadAsync(content, overwrite: false, cancellationToken);
    await blob.SetHttpHeadersAsync(new Azure.Storage.Blobs.Models.BlobHttpHeaders
    {
      ContentType = contentType
    }, cancellationToken: cancellationToken);

    return blob.Uri.ToString();
  }
}
