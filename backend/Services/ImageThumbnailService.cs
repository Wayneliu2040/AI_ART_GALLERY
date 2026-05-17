using AIArtGallery.Api.Models.Entities;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace AIArtGallery.Api.Services;

public class ImageThumbnailService(AzureBlobStorageService blobStorageService)
{
  private const int MaxDimension = 600;
  private const string ThumbnailContentType = "image/webp";

  public async Task<ImageThumbnailEntity> CreateThumbnailAsync(
    Stream sourceImage,
    int imageId,
    string sourceBlobName,
    CancellationToken cancellationToken = default)
  {
    using var image = await Image.LoadAsync(sourceImage, cancellationToken);
    var thumbnailSize = CalculateThumbnailSize(image.Width, image.Height);

    image.Mutate(context => context.Resize(new ResizeOptions
    {
      Size = thumbnailSize,
      Mode = ResizeMode.Max
    }));

    await using var thumbnailStream = new MemoryStream();
    await image.SaveAsWebpAsync(thumbnailStream, new WebpEncoder
    {
      Quality = 82
    }, cancellationToken);

    thumbnailStream.Position = 0;
    var thumbnailBlobName = GetThumbnailBlobName(sourceBlobName);
    var thumbnailUpload = await blobStorageService.UploadThumbnailAsync(
      thumbnailStream,
      thumbnailBlobName,
      ThumbnailContentType,
      cancellationToken);

    return new ImageThumbnailEntity
    {
      ImageId = imageId,
      ThumbnailUrl = thumbnailUpload.Url,
      ThumbnailBlobName = thumbnailUpload.BlobName,
      SourceBlobName = sourceBlobName,
      Width = image.Width,
      Height = image.Height,
      SizeBytes = thumbnailStream.Length,
      ContentType = ThumbnailContentType,
      CreatedAt = DateTime.UtcNow
    };
  }

  private static Size CalculateThumbnailSize(int width, int height)
  {
    var scale = Math.Min(1.0 / 3.0, (double)MaxDimension / Math.Max(width, height));
    scale = Math.Min(scale, 1.0);

    return new Size(
      Math.Max(1, (int)Math.Round(width * scale)),
      Math.Max(1, (int)Math.Round(height * scale)));
  }

  private static string GetThumbnailBlobName(string sourceBlobName)
  {
    var directory = Path.GetDirectoryName(sourceBlobName)?.Replace('\\', '/');
    var fileName = Path.GetFileNameWithoutExtension(sourceBlobName);
    var thumbnailFileName = $"{fileName}-thumb.webp";

    return string.IsNullOrWhiteSpace(directory)
      ? thumbnailFileName
      : $"{directory}/{thumbnailFileName}";
  }
}
