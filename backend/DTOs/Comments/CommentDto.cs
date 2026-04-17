namespace AIArtGallery.Api.DTOs.Comments;

public class CommentDto
{
  public int Id { get; set; }
  public string AuthorName { get; set; } = string.Empty;
  public string Content { get; set; } = string.Empty;
  public DateTime CreatedAt { get; set; }
}
