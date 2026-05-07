# AI Art Gallery 后端 Azure VM 部署与测试操作手册

本文档用于把 `backend/` 目录下的 `.NET 8 Web API` 部署到 Azure VM，并连接 Azure SQL Database 与 Azure Blob Storage 做云端真实测试。

当前项目后端包含：

- ASP.NET Core Web API
- JWT 登录注册
- Azure SQL Database 数据访问
- Azure Blob Storage 图片上传
- Swagger
- `/health` 健康检查接口

## 1. 推荐部署路线

建议先走下面这条路线：

```text
GitHub Repo -> Azure VM -> Docker container -> Azure SQL Database + Azure Blob Storage
```

原因：

- 当前后端已经有 `backend/Dockerfile`
- Docker 部署比直接在 VM 安装 .NET Runtime 更干净
- 后续更新代码时可以在 VM 上 `git pull` 后重新 build/run
- 适合学生项目展示 Azure VM、Azure SQL、Blob Storage 三个核心资源

重要提醒：

- 后端独立测试可以先用 `http://<vm-public-ip>:8080`
- 前端 Azure Static Web Apps 是 HTTPS 页面，如果要从前端直接调用后端，后端最终最好也提供 HTTPS 地址
- 如果前端 HTTPS 调用 HTTP API，浏览器通常会因为 mixed content 阻止请求

## 2. Azure 资源清单

需要准备：

- Azure Resource Group
- Azure Virtual Machine
- Azure SQL Database
- Azure Storage Account
- Azure Blob Container
- GitHub repository

建议命名：

```text
Resource Group: rg-ai-art-gallery
VM: vm-ai-art-gallery-api
SQL Server: sql-ai-art-gallery-<unique>
SQL Database: AIArtGalleryDb
Storage Account: aiartgallery<unique>
Blob Container: ai-images
```

## 3. 创建 Azure SQL Database

在 Azure Portal 中：

1. 搜索 `SQL databases`
2. 点击 `Create`
3. 创建或选择 Resource Group
4. Database name 填：`AIArtGalleryDb`
5. Server 新建一个 Azure SQL logical server
6. 记录：
   - Server name
   - Admin username
   - Admin password
   - Database name

连接字符串格式：

```text
Server=tcp:<server>.database.windows.net,1433;Initial Catalog=AIArtGalleryDb;Persist Security Info=False;User ID=<user>;Password=<password>;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

### 3.1 配置 SQL 防火墙

Azure SQL 默认会拒绝外部连接。测试阶段至少需要允许：

- 你的本机 IP，用于在 Portal Query Editor / Azure Data Studio 测试
- Azure VM 的出站公网 IP，供后端 API 连接数据库

学生项目测试阶段可以临时开启：

```text
Allow Azure services and resources to access this server
```

更稳的做法是只添加 VM 公网 IP 或实际出口 IP。正式展示前建议尽量收窄访问范围。

### 3.2 执行数据库脚本

执行项目中的建表脚本：

```text
database/sql/001_create_schema.sql
```

可选执行 demo 数据：

```text
database/sql/002_seed_demo_data.sql
```

执行方式可以选择：

- Azure Portal -> SQL Database -> Query editor
- Azure Data Studio
- SQL Server Management Studio

完成后确认存在这些表：

- `Users`
- `Images`
- `Comments`
- `Likes`

## 4. 创建 Azure Blob Storage

在 Azure Portal 中：

1. 搜索 `Storage accounts`
2. 创建 Storage Account
3. 进入 Storage Account
4. 找到 `Data storage` -> `Containers`
5. 新建 container：`ai-images`

当前后端上传成功后会把 `blob.Uri.ToString()` 保存到数据库。也就是说，前端显示图片时会直接访问 Blob URL。

因此 MVP 测试有两个选择：

- 简单测试：允许 container 的匿名 Blob 读取，让前端可以直接显示图片
- 更安全方案：以后改后端生成 SAS URL 或图片代理接口

当前项目建议先使用简单测试方案。否则上传成功后，数据库里有 URL，但前端可能无法显示图片。

### 4.1 获取 Storage 连接字符串

进入 Storage Account：

```text
Security + networking -> Access keys -> Show -> Connection string
```

后端需要配置：

```text
AzureStorage__ConnectionString=<storage-connection-string>
AzureStorage__ContainerName=ai-images
```

## 5. 创建 Azure VM

建议配置：

```text
Image: Ubuntu Server 22.04 LTS 或 24.04 LTS
Size: B1s / B2s 均可，B2s 更稳
Authentication: SSH key
Inbound ports: SSH 22
```

后端 API 测试需要开放：

```text
TCP 8080
```

如果后续配置 Nginx/HTTPS，还需要开放：

```text
TCP 80
TCP 443
```

在 Azure Portal 的 VM 网络安全组中添加 inbound rule：

```text
Source: Your IP 或 Any
Destination port: 8080
Protocol: TCP
Action: Allow
Priority: 例如 300
Name: Allow-API-8080
```

测试阶段可以先开放 `Any`，展示完成后建议改成更小范围。

## 6. 在 VM 上安装 Docker 和 Git

SSH 登录 VM：

```bash
ssh <user>@<vm-public-ip>
```

安装依赖：

```bash
sudo apt update
sudo apt install -y git docker.io
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER
```

执行完 `usermod` 后，建议退出 SSH 再重新登录。

验证：

```bash
git --version
docker --version
```

## 7. 拉取项目代码

在 VM 上执行：

```bash
git clone https://github.com/Wayneliu2040/AI_ART_GALLERY.git
cd AI_ART_GALLERY/backend
```

如果仓库已经存在，更新代码：

```bash
cd ~/AI_ART_GALLERY
git pull origin main
cd backend
```

## 8. 构建后端 Docker 镜像

在 VM 的 `backend` 目录执行：

```bash
docker build -t ai-art-gallery-api .
```

成功后查看镜像：

```bash
docker images
```

## 9. 启动后端容器

先准备这些真实配置：

```text
SQL_CONNECTION_STRING=<Azure SQL connection string>
STORAGE_CONNECTION_STRING=<Azure Storage connection string>
STATIC_WEB_APP_URL=https://<your-static-web-app>.azurestaticapps.net
JWT_SECRET=<a-long-random-secret-at-least-32-characters>
```

停止旧容器：

```bash
docker stop ai-art-gallery-api || true
docker rm ai-art-gallery-api || true
```

启动新容器：

```bash
docker run -d \
  --restart unless-stopped \
  --name ai-art-gallery-api \
  -p 8080:8080 \
  -e "ConnectionStrings__DefaultConnection=<Azure SQL connection string>" \
  -e "Jwt__Issuer=AIArtGallery.Api" \
  -e "Jwt__Audience=AIArtGallery.Frontend" \
  -e "Jwt__SecretKey=<a-long-random-secret-at-least-32-characters>" \
  -e "Jwt__ExpiryMinutes=120" \
  -e "AzureStorage__ConnectionString=<Azure Storage connection string>" \
  -e "AzureStorage__ContainerName=ai-images" \
  -e "Cors__AllowedOrigins__0=https://<your-static-web-app>.azurestaticapps.net" \
  ai-art-gallery-api
```

查看运行状态：

```bash
docker ps
docker logs ai-art-gallery-api
```

## 10. 后端独立测试

### 10.1 健康检查

浏览器访问：

```text
http://<vm-public-ip>:8080/health
```

期望返回：

```json
{
  "status": "ok",
  "service": "AI Art Gallery API"
}
```

### 10.2 Swagger

浏览器访问：

```text
http://<vm-public-ip>:8080/swagger
```

如果 Swagger 能打开，说明 API 容器和端口暴露基本正常。

### 10.3 注册用户

PowerShell 测试：

```powershell
$body = @{
  name = "Demo User"
  email = "demo@aiartgallery.app"
  password = "Password123!"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Post `
  -Uri "http://<vm-public-ip>:8080/api/auth/register" `
  -ContentType "application/json" `
  -Body $body
```

期望返回 token 和用户信息。

### 10.4 登录

```powershell
$body = @{
  email = "demo@aiartgallery.app"
  password = "Password123!"
} | ConvertTo-Json

$login = Invoke-RestMethod `
  -Method Post `
  -Uri "http://<vm-public-ip>:8080/api/auth/login" `
  -ContentType "application/json" `
  -Body $body

$token = $login.token
$token
```

### 10.5 查询图片列表

```powershell
Invoke-RestMethod -Uri "http://<vm-public-ip>:8080/api/images"
```

### 10.6 上传图片

PowerShell 的 multipart 测试比 Swagger 更麻烦，建议优先用 Swagger：

```text
POST /api/images
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

字段：

```text
Title
Tag
Platform
Description
Prompt
File
```

推荐测试值：

```text
Title: Cloud Test Artwork
Tag: landscape
Platform: Azure OpenAI + Prompt Workflow
Description: Test image uploaded from Azure backend deployment.
Prompt: A cinematic AI generated landscape with soft museum lighting.
File: 选择一张本地 jpg/png 图片
```

上传成功后检查：

- Azure Blob container 中是否出现图片文件
- Azure SQL `Images` 表中是否出现 metadata
- `GET /api/images` 是否能看到新图片
- 前端是否能显示 Blob 图片

## 11. 和前端 Azure Static Web Apps 联调

前端生产环境需要把：

```text
VITE_API_BASE_URL
VITE_ENABLE_MOCKS
```

设置为真实 API。

示例：

```env
VITE_API_BASE_URL=https://<your-api-domain>/api
VITE_ENABLE_MOCKS=false
```

重要：如果你只使用 `http://<vm-public-ip>:8080/api`，Azure Static Web Apps 页面是 HTTPS，浏览器可能会阻止请求。更推荐：

```text
https://api.<your-domain>/api
```

最简 HTTPS 方案：

1. 给 VM 绑定一个域名
2. 安装 Nginx
3. 用 Nginx 反向代理到 `http://127.0.0.1:8080`
4. 用 Let's Encrypt 配置 HTTPS

如果暂时没有域名，可以先完成后端独立测试，再处理前端联调。

## 12. Nginx/HTTPS 后续配置方向

安装 Nginx：

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

Nginx 代理目标：

```text
http://127.0.0.1:8080
```

配置 HTTPS 后，最终 API 地址应类似：

```text
https://api.example.com/api
```

这一步可以等后端 HTTP 测试完成后再做，避免一次性排查太多变量。

## 13. 常见问题排查

### 13.1 `/health` 访问不到

检查：

```bash
docker ps
docker logs ai-art-gallery-api
```

同时检查 Azure VM NSG 是否开放 `8080`。

### 13.2 Swagger 能打开，但注册失败

重点检查：

- Azure SQL connection string 是否正确
- SQL Server firewall 是否允许 VM 访问
- `Users` 表是否已经创建
- 容器日志是否有 SQL 登录失败信息

### 13.3 上传失败

重点检查：

- `AzureStorage__ConnectionString`
- `AzureStorage__ContainerName`
- Blob container 是否存在
- Storage Account access key 是否复制完整
- 上传文件是否过大，当前后端 `RequestSizeLimit` 是 20 MB

### 13.4 上传成功但图片不显示

通常是 Blob 访问权限问题。当前项目保存的是 Blob URL，前端直接读取该 URL。

解决方向：

- MVP 阶段允许 container 匿名 Blob 读取
- 或后续改后端生成 SAS URL
- 或后续通过 API 代理图片读取

### 13.5 前端调用 API 报 CORS

检查容器启动参数：

```text
Cors__AllowedOrigins__0=https://<your-static-web-app>.azurestaticapps.net
```

必须和浏览器地址栏里的前端 origin 完全一致。

### 13.6 前端调用 API 报 mixed content

原因：

```text
HTTPS frontend -> HTTP backend
```

解决：

- 给后端配置 HTTPS
- 或先只用 Swagger/Postman 独立测试后端

## 14. 建议测试顺序

按这个顺序做，最容易定位问题：

1. Azure SQL 建库并执行 schema
2. Azure Blob 创建 `ai-images` container
3. Azure VM 安装 Docker/Git
4. VM 拉代码并构建后端镜像
5. 启动 API 容器
6. 测试 `/health`
7. 测试 `/swagger`
8. 测试 register/login
9. 测试 image list
10. 测试 image upload
11. 检查 SQL 和 Blob 是否有真实数据
12. 配置 HTTPS 后再联调 Azure Static Web Apps

## 15. 部署完成检查清单

- [ ] VM 可以 SSH 登录
- [ ] VM NSG 开放 8080
- [ ] Docker 已安装
- [ ] API 容器正在运行
- [ ] `/health` 正常
- [ ] `/swagger` 正常
- [ ] Azure SQL schema 已执行
- [ ] API 可以连接 Azure SQL
- [ ] Blob container `ai-images` 已创建
- [ ] API 可以上传图片到 Blob
- [ ] `POST /api/auth/register` 正常
- [ ] `POST /api/auth/login` 正常
- [ ] `GET /api/images` 正常
- [ ] `POST /api/images` 正常
- [ ] 前端生产环境已关闭 mock：`VITE_ENABLE_MOCKS=false`
- [ ] 前端 `VITE_API_BASE_URL` 指向真实 API
- [ ] 如需前端联调，后端 API 已支持 HTTPS

## 16. 官方参考

- Azure Blob Storage container 管理：<https://learn.microsoft.com/en-us/azure/storage/blobs/blob-containers-portal>
- Azure Blob Storage quickstart：<https://learn.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-portal>
- Azure SQL network access controls：<https://learn.microsoft.com/en-us/azure/azure-sql/database/network-access-controls-overview>
- Azure Network Security Groups：<https://learn.microsoft.com/en-us/azure/virtual-network/manage-network-security-group>
- ASP.NET Core on Linux with Nginx：<https://learn.microsoft.com/aspnet/core/host-and-deploy/linux-nginx>

