using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using AIArtGallery.Api.Options;
using Microsoft.Extensions.Options;

namespace AIArtGallery.Api.Services;

public class AzureBlobStorageService(IOptions<AzureStorageOptions> options)
{
  private readonly AzureStorageOptions _storageOptions = options.Value;

  public async Task<BlobUploadResult> UploadAsync(Stream content, string fileName, string contentType, CancellationToken cancellationToken = default)
  {
    var safeFileName = $"{DateTime.UtcNow:yyyyMMddHHmmssfff}-{Guid.NewGuid():N}-{fileName}";
    return await UploadToContainerAsync(_storageOptions.ContainerName, safeFileName, content, contentType, cancellationToken);
  }

  public async Task<BlobUploadResult> UploadThumbnailAsync(Stream content, string blobName, string contentType, CancellationToken cancellationToken = default)
  {
    return await UploadToContainerAsync(_storageOptions.ThumbnailContainerName, blobName, content, contentType, cancellationToken);
  }

  private async Task<BlobUploadResult> UploadToContainerAsync(
    string containerName,
    string blobName,
    Stream content,
    string contentType,
    CancellationToken cancellationToken)
  {
    var container = new BlobContainerClient(_storageOptions.ConnectionString, containerName);
    await container.CreateIfNotExistsAsync(cancellationToken: cancellationToken);

    var blob = container.GetBlobClient(blobName);
    await blob.UploadAsync(content, overwrite: false, cancellationToken);
    await blob.SetHttpHeadersAsync(new BlobHttpHeaders
    {
      ContentType = contentType
    }, cancellationToken: cancellationToken);

    return new BlobUploadResult(blob.Uri.ToString(), blobName);
  }
}

public record BlobUploadResult(string Url, string BlobName);
