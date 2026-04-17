using Microsoft.AspNetCore.Http;

namespace AIArtGallery.Api.DTOs.Images;

public class CreateImageRequest
{
  public string Title { get; set; } = string.Empty;
  public string Tag { get; set; } = string.Empty;
  public string Platform { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public string Prompt { get; set; } = string.Empty;
  public IFormFile? File { get; set; }
}
