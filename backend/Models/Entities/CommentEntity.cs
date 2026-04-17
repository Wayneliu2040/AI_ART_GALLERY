namespace AIArtGallery.Api.Models.Entities;

public class CommentEntity
{
  public int Id { get; set; }
  public int ImageId { get; set; }
  public int UserId { get; set; }
  public string Content { get; set; } = string.Empty;
  public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

  public ImageEntity? Image { get; set; }
  public UserEntity? User { get; set; }
}
