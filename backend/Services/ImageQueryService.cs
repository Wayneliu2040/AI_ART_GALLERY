using AIArtGallery.Api.DTOs.Comments;
using AIArtGallery.Api.DTOs.Images;
using AIArtGallery.Api.Models.Entities;

namespace AIArtGallery.Api.Services;

public class ImageQueryService
{
  public ImageListItemDto MapListItem(ImageEntity image, int? currentUserId = null) =>
    new()
    {
      Id = image.Id,
      Title = image.Title,
      Tag = image.Tag,
      Description = image.Description,
      Platform = image.Platform,
      Prompt = image.Prompt,
      ImageUrl = image.BlobUrl,
      AuthorName = image.User?.UserName ?? string.Empty,
      Likes = image.Likes.Count,
      IsLikedByCurrentUser = currentUserId.HasValue && image.Likes.Any(x => x.UserId == currentUserId.Value),
      CommentsCount = image.Comments.Count,
      CreatedAt = image.CreatedAtUtc
    };

  public ImageDetailDto MapDetail(ImageEntity image, int? currentUserId = null) =>
    new()
    {
      Id = image.Id,
      Title = image.Title,
      Tag = image.Tag,
      Description = image.Description,
      Platform = image.Platform,
      Prompt = image.Prompt,
      ImageUrl = image.BlobUrl,
      AuthorName = image.User?.UserName ?? string.Empty,
      Likes = image.Likes.Count,
      IsLikedByCurrentUser = currentUserId.HasValue && image.Likes.Any(x => x.UserId == currentUserId.Value),
      CommentsCount = image.Comments.Count,
      CreatedAt = image.CreatedAtUtc
    };

  public CommentDto MapComment(CommentEntity comment) =>
    new()
    {
      Id = comment.Id,
      AuthorName = comment.User?.UserName ?? string.Empty,
      Content = comment.Content,
      CreatedAt = comment.CreatedAtUtc
    };
}
