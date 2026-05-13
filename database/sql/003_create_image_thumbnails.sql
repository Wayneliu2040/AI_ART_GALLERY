IF OBJECT_ID(N'dbo.ImageThumbnails', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.ImageThumbnails (
    Id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ImageThumbnails PRIMARY KEY,
    ImageId INT NOT NULL,
    ThumbnailUrl NVARCHAR(1000) NOT NULL,
    ThumbnailBlobName NVARCHAR(500) NULL,
    SourceBlobName NVARCHAR(500) NULL,
    Width INT NULL,
    Height INT NULL,
    SizeBytes BIGINT NULL,
    ContentType NVARCHAR(100) NULL,
    CreatedAt DATETIME2 NOT NULL CONSTRAINT DF_ImageThumbnails_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_ImageThumbnails_Images FOREIGN KEY (ImageId) REFERENCES dbo.Images(Id) ON DELETE CASCADE
  );
END;

IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = N'UX_ImageThumbnails_ImageId'
    AND object_id = OBJECT_ID(N'dbo.ImageThumbnails')
)
BEGIN
  CREATE UNIQUE INDEX UX_ImageThumbnails_ImageId ON dbo.ImageThumbnails (ImageId);
END;

IF NOT EXISTS (
  SELECT 1
  FROM sys.indexes
  WHERE name = N'IX_ImageThumbnails_SourceBlobName'
    AND object_id = OBJECT_ID(N'dbo.ImageThumbnails')
)
BEGIN
  CREATE INDEX IX_ImageThumbnails_SourceBlobName ON dbo.ImageThumbnails (SourceBlobName);
END;
