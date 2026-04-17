namespace AIArtGallery.Api.Models.Entities;

public class LikeEntity
{
  public int Id { get; set; }
  public int ImageId { get; set; }
  public int UserId { get; set; }
  public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

  public ImageEntity? Image { get; set; }
  public UserEntity? User { get; set; }
}
