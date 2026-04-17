using AIArtGallery.Api.Data;
using AIArtGallery.Api.DTOs.Auth;
using AIArtGallery.Api.Models.Entities;
using AIArtGallery.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AIArtGallery.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(
  AppDbContext dbContext,
  PasswordService passwordService,
  JwtTokenService jwtTokenService) : ControllerBase
{
  [HttpPost("register")]
  public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
  {
    var email = request.Email.Trim().ToLowerInvariant();

    if (await dbContext.Users.AnyAsync(x => x.Email == email))
    {
      return Conflict(new { message = "An account with this email already exists." });
    }

    var user = new UserEntity
    {
      UserName = request.Name.Trim(),
      Email = email,
      PasswordHash = passwordService.HashPassword(request.Password)
    };

    dbContext.Users.Add(user);
    await dbContext.SaveChangesAsync();

    return Ok(new AuthResponse
    {
      Name = user.UserName,
      Email = user.Email,
      Token = jwtTokenService.CreateToken(user)
    });
  }

  [HttpPost("login")]
  public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
  {
    var email = request.Email.Trim().ToLowerInvariant();
    var user = await dbContext.Users.FirstOrDefaultAsync(x => x.Email == email);

    if (user is null || !passwordService.VerifyPassword(request.Password, user.PasswordHash))
    {
      return Unauthorized(new { message = "Invalid email or password." });
    }

    return Ok(new AuthResponse
    {
      Name = user.UserName,
      Email = user.Email,
      Token = jwtTokenService.CreateToken(user)
    });
  }
}
