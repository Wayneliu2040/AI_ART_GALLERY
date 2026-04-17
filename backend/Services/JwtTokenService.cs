using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AIArtGallery.Api.Models.Entities;
using AIArtGallery.Api.Options;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace AIArtGallery.Api.Services;

public class JwtTokenService(IOptions<JwtOptions> options)
{
  private readonly JwtOptions _jwtOptions = options.Value;

  public string CreateToken(UserEntity user)
  {
    var claims = new List<Claim>
    {
      new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
      new(JwtRegisteredClaimNames.Email, user.Email),
      new("name", user.UserName)
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey));
    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
    var expires = DateTime.UtcNow.AddMinutes(_jwtOptions.ExpiryMinutes);

    var token = new JwtSecurityToken(
      issuer: _jwtOptions.Issuer,
      audience: _jwtOptions.Audience,
      claims: claims,
      expires: expires,
      signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
  }
}
