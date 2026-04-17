# AI Art Gallery Backend

This folder contains an Azure-ready `.NET 8 Web API` backend for the AI Art Gallery project.

## Included Features

- JWT-based authentication
- Azure SQL Database integration through Entity Framework Core
- Azure Blob Storage integration for uploaded image files
- REST APIs for:
  - register
  - login
  - image list
  - image detail
  - image upload
  - comments
  - likes
  - user summary
- Swagger enabled by default
- health endpoint at `/health`

## Main Files

- `Program.cs`
- `appsettings.json`
- `Dockerfile`
- `Data/AppDbContext.cs`
- `Controllers/AuthController.cs`
- `Controllers/ImagesController.cs`
- `Controllers/UsersController.cs`
- `Services/AzureBlobStorageService.cs`
- `Services/JwtTokenService.cs`
- `Services/ImageQueryService.cs`

## Target Runtime

- .NET 8
- Azure SQL Database
- Azure Blob Storage
- Azure VM deployment target

## Expected Environment Configuration

Update the values in:

- `appsettings.json`
- or use environment variables / Azure App Settings in production

Important configuration sections:

- `ConnectionStrings:DefaultConnection`
- `Jwt`
- `AzureStorage`
- `Cors`

## Suggested Next Steps

1. Restore packages with `dotnet restore`
2. Update the connection string and storage settings
3. Create the Azure SQL schema from the scripts in the `database/` folder
4. Run the API locally or on your Azure VM
5. Connect the React frontend to this backend

## Optional Docker Run

Build:

```powershell
docker build -t ai-art-gallery-api .
```

Run:

```powershell
docker run --rm -p 8080:8080 --name ai-art-gallery-api ai-art-gallery-api
```
