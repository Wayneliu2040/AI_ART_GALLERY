namespace AIArtGallery.Api.Models.Entities;

public class ImageEntity
{
  public int Id { get; set; }
  public int UserId { get; set; }
  public string Title { get; set; } = string.Empty;
  public string Tag { get; set; } = string.Empty;
  public string Platform { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public string Prompt { get; set; } = string.Empty;
  public string BlobUrl { get; set; } = string.Empty;
  public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

  public UserEntity? User { get; set; }
  public ICollection<CommentEntity> Comments { get; set; } = new List<CommentEntity>();
  public ICollection<LikeEntity> Likes { get; set; } = new List<LikeEntity>();
}
