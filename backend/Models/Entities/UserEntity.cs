namespace AIArtGallery.Api.Models.Entities;

public class UserEntity
{
  public int Id { get; set; }
  public string UserName { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public string PasswordHash { get; set; } = string.Empty;
  public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

  public ICollection<ImageEntity> Images { get; set; } = new List<ImageEntity>();
  public ICollection<CommentEntity> Comments { get; set; } = new List<CommentEntity>();
  public ICollection<LikeEntity> Likes { get; set; } = new List<LikeEntity>();
}
