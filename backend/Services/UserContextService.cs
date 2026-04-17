using System.Security.Claims;

namespace AIArtGallery.Api.Services;

public class UserContextService(IHttpContextAccessor httpContextAccessor)
{
  public int? GetCurrentUserId()
  {
    var value = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)
      ?? httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Name)
      ?? httpContextAccessor.HttpContext?.User.FindFirstValue("sub");

    return int.TryParse(value, out var userId) ? userId : null;
  }
}
