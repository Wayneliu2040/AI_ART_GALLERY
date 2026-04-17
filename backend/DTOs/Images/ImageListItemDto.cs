namespace AIArtGallery.Api.DTOs.Images;

public class ImageListItemDto
{
  public int Id { get; set; }
  public string Title { get; set; } = string.Empty;
  public string Tag { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public string Platform { get; set; } = string.Empty;
  public string Prompt { get; set; } = string.Empty;
  public string ImageUrl { get; set; } = string.Empty;
  public string AuthorName { get; set; } = string.Empty;
  public int Likes { get; set; }
  public int CommentsCount { get; set; }
  public DateTime CreatedAt { get; set; }
}
