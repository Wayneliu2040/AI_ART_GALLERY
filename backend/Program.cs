using System.Text;
using AIArtGallery.Api.Data;
using AIArtGallery.Api.Options;
using AIArtGallery.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));
builder.Services.Configure<AzureStorageOptions>(builder.Configuration.GetSection(AzureStorageOptions.SectionName));

builder.Services.AddDbContext<AppDbContext>(options =>
  options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<PasswordService>();
builder.Services.AddScoped<UserContextService>();
builder.Services.AddScoped<AzureBlobStorageService>();
builder.Services.AddScoped<ImageQueryService>();

builder.Services.AddCors(options =>
{
  options.AddPolicy("Frontend", policy =>
  {
    var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
    if (allowedOrigins.Length == 0)
    {
      policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
      return;
    }

    policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod();
  });
});

builder.Services
  .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options =>
  {
    var jwtOptions = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>() ?? new JwtOptions();
    options.TokenValidationParameters = new TokenValidationParameters
    {
      ValidateIssuer = true,
      ValidateAudience = true,
      ValidateLifetime = true,
      ValidateIssuerSigningKey = true,
      ValidIssuer = jwtOptions.Issuer,
      ValidAudience = jwtOptions.Audience,
      IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SecretKey))
    };
  });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.MapGet("/health", () => Results.Ok(new
{
  status = "ok",
  service = "AI Art Gallery API",
  utcTime = DateTime.UtcNow
}));

app.Run();
