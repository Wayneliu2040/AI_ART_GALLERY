# AI Art Gallery Backend

这个文件夹包含了 `AI Art Gallery` 项目的 Azure-ready `.NET 8 Web API` 后端代码骨架。

## 已包含的功能

- 基于 JWT 的认证
- 通过 Entity Framework Core 接入 Azure SQL Database
- 接入 Azure Blob Storage 存储上传图片
- 已预留并实现以下 REST API：
  - 注册
  - 登录
  - 图片列表
  - 图片详情
  - 图片上传
  - 评论
  - 点赞
  - 用户统计摘要
- 默认启用 Swagger
- 提供 `/health` 健康检查接口

## 主要文件

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

## 目标运行环境

- .NET 8
- Azure SQL Database
- Azure Blob Storage
- Azure VM

## 需要配置的内容

你需要更新：

- `appsettings.json`
- 或者在生产环境中改为环境变量 / Azure App Settings

重点配置项：

- `ConnectionStrings:DefaultConnection`
- `Jwt`
- `AzureStorage`
- `Cors`

## 建议下一步

1. 执行 `dotnet restore`
2. 配置数据库连接字符串和 Blob Storage 参数
3. 使用 `database/` 文件夹中的 SQL 脚本创建 Azure SQL 数据表
4. 在本地或 Azure VM 上运行 API
5. 将 React 前端接入该后端

## 可选：使用 Docker 运行后端

构建镜像：

```powershell
docker build -t ai-art-gallery-api .
```

运行容器：

```powershell
docker run --rm -p 8080:8080 --name ai-art-gallery-api ai-art-gallery-api
```
