using AIArtGallery.Api.Data;
using AIArtGallery.Api.DTOs.Images;
using AIArtGallery.Api.DTOs.Users;
using AIArtGallery.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AIArtGallery.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/users")]
public class UsersController(
  AppDbContext dbContext,
  UserContextService userContextService,
  ImageQueryService imageQueryService) : ControllerBase
{
  [HttpGet("me/summary")]
  public async Task<ActionResult<UserSummaryDto>> GetMySummary()
  {
    var userId = userContextService.GetCurrentUserId();
    if (userId is null)
    {
      return Unauthorized(new { message = "User not authenticated." });
    }

    var images = await dbContext.Images
      .Include(x => x.Comments)
      .Include(x => x.Likes)
      .Where(x => x.UserId == userId.Value)
      .ToListAsync();

    return Ok(new UserSummaryDto
    {
      UploadCount = images.Count,
      ReceivedLikes = images.Sum(x => x.Likes.Count),
      ReceivedComments = images.Sum(x => x.Comments.Count)
    });
  }

  [HttpGet("me/images")]
  public async Task<ActionResult<IEnumerable<ImageListItemDto>>> GetMyImages()
  {
    var userId = userContextService.GetCurrentUserId();
    if (userId is null)
    {
      return Unauthorized(new { message = "User not authenticated." });
    }

    var images = await dbContext.Images
      .Include(x => x.User)
      .Include(x => x.Comments)
      .Include(x => x.Likes)
      .Where(x => x.UserId == userId.Value)
      .OrderByDescending(x => x.CreatedAtUtc)
      .ToListAsync();

    return Ok(images.Select(imageQueryService.MapListItem));
  }
}
