namespace AIArtGallery.Api.Options;

public class JwtOptions
{
  public const string SectionName = "Jwt";

  public string Issuer { get; set; } = "AIArtGallery.Api";
  public string Audience { get; set; } = "AIArtGallery.Frontend";
  public string SecretKey { get; set; } = "ReplaceWithARealSecretKeyThatIsAtLeast32Characters";
  public int ExpiryMinutes { get; set; } = 120;
}
