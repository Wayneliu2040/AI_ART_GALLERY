namespace AIArtGallery.Api.Models.Entities;

public class ImageThumbnailEntity
{
  public int Id { get; set; }
  public int ImageId { get; set; }
  public string ThumbnailUrl { get; set; } = string.Empty;
  public string? ThumbnailBlobName { get; set; }
  public string? SourceBlobName { get; set; }
  public int? Width { get; set; }
  public int? Height { get; set; }
  public long? SizeBytes { get; set; }
  public string? ContentType { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

  public ImageEntity? Image { get; set; }
}
