using AIArtGallery.Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace AIArtGallery.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
  public DbSet<UserEntity> Users => Set<UserEntity>();
  public DbSet<ImageEntity> Images => Set<ImageEntity>();
  public DbSet<CommentEntity> Comments => Set<CommentEntity>();
  public DbSet<LikeEntity> Likes => Set<LikeEntity>();

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<UserEntity>(entity =>
    {
      entity.ToTable("Users");
      entity.HasKey(x => x.Id);
      entity.Property(x => x.UserName).HasMaxLength(100).IsRequired();
      entity.Property(x => x.Email).HasMaxLength(256).IsRequired();
      entity.Property(x => x.PasswordHash).HasMaxLength(256).IsRequired();
      entity.HasIndex(x => x.Email).IsUnique();
    });

    modelBuilder.Entity<ImageEntity>(entity =>
    {
      entity.ToTable("Images");
      entity.HasKey(x => x.Id);
      entity.Property(x => x.Title).HasMaxLength(200).IsRequired();
      entity.Property(x => x.Tag).HasMaxLength(80).IsRequired();
      entity.Property(x => x.Platform).HasMaxLength(150).IsRequired();
      entity.Property(x => x.Description).HasMaxLength(2000).IsRequired();
      entity.Property(x => x.Prompt).HasMaxLength(4000).IsRequired();
      entity.Property(x => x.BlobUrl).HasMaxLength(1000).IsRequired();
      entity.HasIndex(x => x.CreatedAtUtc);
      entity.HasIndex(x => x.Tag);
      entity.HasOne(x => x.User).WithMany(x => x.Images).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Cascade);
    });

    modelBuilder.Entity<CommentEntity>(entity =>
    {
      entity.ToTable("Comments");
      entity.HasKey(x => x.Id);
      entity.Property(x => x.Content).HasMaxLength(1000).IsRequired();
      entity.HasIndex(x => x.ImageId);
      entity.HasOne(x => x.Image).WithMany(x => x.Comments).HasForeignKey(x => x.ImageId).OnDelete(DeleteBehavior.Cascade);
      entity.HasOne(x => x.User).WithMany(x => x.Comments).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.NoAction);
    });

    modelBuilder.Entity<LikeEntity>(entity =>
    {
      entity.ToTable("Likes");
      entity.HasKey(x => x.Id);
      entity.HasIndex(x => new { x.ImageId, x.UserId }).IsUnique();
      entity.HasOne(x => x.Image).WithMany(x => x.Likes).HasForeignKey(x => x.ImageId).OnDelete(DeleteBehavior.Cascade);
      entity.HasOne(x => x.User).WithMany(x => x.Likes).HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.NoAction);
    });
  }
}
