using AIArtGallery.Api.Data;
using AIArtGallery.Api.DTOs.Comments;
using AIArtGallery.Api.DTOs.Images;
using AIArtGallery.Api.Models.Entities;
using AIArtGallery.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AIArtGallery.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImagesController(
  AppDbContext dbContext,
  AzureBlobStorageService blobStorageService,
  ImageQueryService imageQueryService,
  UserContextService userContextService) : ControllerBase
{
  [HttpGet]
  public async Task<ActionResult<IEnumerable<ImageListItemDto>>> GetImages([FromQuery] string? q, [FromQuery] string? tag)
  {
    var query = dbContext.Images
      .Include(x => x.User)
      .Include(x => x.Comments)
      .Include(x => x.Likes)
      .AsQueryable();

    if (!string.IsNullOrWhiteSpace(q))
    {
      var normalized = q.Trim().ToLower();
      query = query.Where(x =>
        x.Title.ToLower().Contains(normalized) ||
        x.Description.ToLower().Contains(normalized) ||
        x.Prompt.ToLower().Contains(normalized) ||
        x.Platform.ToLower().Contains(normalized) ||
        x.User!.UserName.ToLower().Contains(normalized));
    }

    if (!string.IsNullOrWhiteSpace(tag))
    {
      var normalizedTag = tag.Trim().ToLower();
      query = query.Where(x => x.Tag.ToLower() == normalizedTag);
    }

    var images = await query
      .OrderByDescending(x => x.CreatedAtUtc)
      .ToListAsync();

    return Ok(images.Select(imageQueryService.MapListItem));
  }

  [Authorize]
  [HttpPost]
  [RequestSizeLimit(20_000_000)]
  public async Task<ActionResult<ImageDetailDto>> CreateImage([FromForm] CreateImageRequest request, CancellationToken cancellationToken)
  {
    var userId = userContextService.GetCurrentUserId();
    if (userId is null)
    {
      return Unauthorized(new { message = "User not authenticated." });
    }

    if (request.File is null || request.File.Length == 0)
    {
      return BadRequest(new { message = "Image file is required." });
    }

    var user = await dbContext.Users.FirstAsync(x => x.Id == userId.Value, cancellationToken);

    await using var stream = request.File.OpenReadStream();
    var blobUrl = await blobStorageService.UploadAsync(stream, request.File.FileName, request.File.ContentType, cancellationToken);

    var image = new ImageEntity
    {
      UserId = user.Id,
      Title = request.Title.Trim(),
      Tag = request.Tag.Trim(),
      Platform = request.Platform.Trim(),
      Description = request.Description.Trim(),
      Prompt = request.Prompt.Trim(),
      BlobUrl = blobUrl
    };

    dbContext.Images.Add(image);
    await dbContext.SaveChangesAsync(cancellationToken);

    image.User = user;
    return Ok(imageQueryService.MapDetail(image));
  }

  [HttpGet("{id:int}")]
  public async Task<ActionResult<ImageDetailDto>> GetImage(int id)
  {
    var image = await dbContext.Images
      .Include(x => x.User)
      .Include(x => x.Comments)
      .Include(x => x.Likes)
      .FirstOrDefaultAsync(x => x.Id == id);

    if (image is null)
    {
      return NotFound(new { message = "Image not found." });
    }

    return Ok(imageQueryService.MapDetail(image));
  }

  [HttpGet("{id:int}/comments")]
  public async Task<ActionResult<IEnumerable<CommentDto>>> GetComments(int id)
  {
    var comments = await dbContext.Comments
      .Include(x => x.User)
      .Where(x => x.ImageId == id)
      .OrderByDescending(x => x.CreatedAtUtc)
      .ToListAsync();

    return Ok(comments.Select(imageQueryService.MapComment));
  }

  [Authorize]
  [HttpPost("{id:int}/comments")]
  public async Task<ActionResult<CommentDto>> CreateComment(int id, CreateCommentRequest request)
  {
    var userId = userContextService.GetCurrentUserId();
    if (userId is null)
    {
      return Unauthorized(new { message = "User not authenticated." });
    }

    var user = await dbContext.Users.FirstAsync(x => x.Id == userId.Value);
    var image = await dbContext.Images.FirstOrDefaultAsync(x => x.Id == id);
    if (image is null)
    {
      return NotFound(new { message = "Image not found." });
    }

    var comment = new CommentEntity
    {
      ImageId = image.Id,
      UserId = user.Id,
      Content = request.Content.Trim()
    };

    dbContext.Comments.Add(comment);
    await dbContext.SaveChangesAsync();

    comment.User = user;
    return Ok(imageQueryService.MapComment(comment));
  }

  [Authorize]
  [HttpPost("{id:int}/like")]
  public async Task<ActionResult<object>> LikeImage(int id)
  {
    var userId = userContextService.GetCurrentUserId();
    if (userId is null)
    {
      return Unauthorized(new { message = "User not authenticated." });
    }

    var image = await dbContext.Images
      .Include(x => x.Likes)
      .FirstOrDefaultAsync(x => x.Id == id);

    if (image is null)
    {
      return NotFound(new { message = "Image not found." });
    }

    var existingLike = await dbContext.Likes.FirstOrDefaultAsync(x => x.ImageId == id && x.UserId == userId.Value);
    if (existingLike is null)
    {
      dbContext.Likes.Add(new LikeEntity
      {
        ImageId = id,
        UserId = userId.Value
      });
      await dbContext.SaveChangesAsync();
    }

    var likeCount = await dbContext.Likes.CountAsync(x => x.ImageId == id);
    return Ok(new { imageId = id, likes = likeCount });
  }
}
