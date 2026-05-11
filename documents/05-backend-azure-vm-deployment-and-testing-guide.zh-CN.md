# AI Art Gallery 后端 Azure VM 直接部署与测试操作手册

本文档用于把 `backend/` 目录下的 `.NET 8 Web API` 直接部署到 Azure Virtual Machine，不使用 Docker。

部署目标：

```text
GitHub Repo -> Azure VM -> .NET 8 Runtime + systemd -> Azure SQL Database + Azure Blob Storage
```

当前后端包含：

- ASP.NET Core Web API
- JWT 注册 / 登录
- Azure SQL Database 数据访问
- Azure Blob Storage 图片上传
- Swagger
- `/health` 健康检查接口

## 1. Azure 资源清单

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
SQL Database: AIArtGalleryDb
Blob Container: ai-images
```

## 2. 创建 Azure SQL Database

在 Azure Portal 中创建 Azure SQL Database：

1. 搜索 `SQL databases`
2. 点击 `Create`
3. Database name 使用 `AIArtGalleryDb`
4. 创建或选择 SQL Server
5. 记录 SQL Server name、admin username、admin password

连接字符串格式：

```text
Server=tcp:<server>.database.windows.net,1433;Initial Catalog=AIArtGalleryDb;Persist Security Info=False;User ID=<user>;Password=<password>;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

### 2.1 配置 SQL 防火墙

至少允许：

- 你的本机 IP，用于手动执行 SQL 脚本
- Azure VM 的公网出口 IP，用于后端连接 SQL

学生项目测试阶段可以临时开启：

```text
Allow Azure services and resources to access this server
```

展示完成后建议收窄访问范围。

### 2.2 执行数据库脚本

执行：

```text
database/sql/001_create_schema.sql
```

可选执行：

```text
database/sql/002_seed_demo_data.sql
```

执行方式：

- Azure Portal -> SQL Database -> Query editor
- Azure Data Studio
- SQL Server Management Studio

完成后确认有这些表：

- `Users`
- `Images`
- `Comments`
- `Likes`

## 3. 创建 Azure Blob Storage

在 Azure Portal 中：

1. 搜索 `Storage accounts`
2. 创建 Storage Account
3. 进入 Storage Account
4. 打开 `Data storage` -> `Containers`
5. 创建 container：`ai-images`

当前代码会把 Blob URL 存到 SQL 的 `Images.BlobUrl` 字段，前端会直接读取该 URL 显示图片。

MVP 测试建议：

- 允许 container 中 Blob 匿名读取，方便前端直接显示图片
- 或后续再改为 SAS URL / 后端代理读取

### 3.1 获取 Storage 连接字符串

进入 Storage Account：

```text
Security + networking -> Access keys -> Show -> Connection string
```

后端需要：

```text
AzureStorage__ConnectionString=<storage-connection-string>
AzureStorage__ContainerName=ai-images
```

## 4. 创建 Azure VM

推荐 VM：

```text
OS: Ubuntu Server 22.04 LTS 或 24.04 LTS
Size: B1s / B2s
Authentication: SSH key
Inbound ports: SSH 22
```

后端测试需要开放：

```text
TCP 8080
```

如果后续配置 Nginx 和 HTTPS，还需要开放：

```text
TCP 80
TCP 443
```

在 VM 的 Network Security Group 中添加 inbound rule：

```text
Source: Your IP 或 Any
Destination port: 8080
Protocol: TCP
Action: Allow
Name: Allow-API-8080
```

## 5. 登录 VM 并安装基础环境

SSH 登录：

```bash
ssh <user>@<vm-public-ip>
```

更新系统并安装 Git：

```bash
sudo apt update
sudo apt install -y git curl wget apt-transport-https
```

## 6. 安装 .NET 8

Ubuntu 22.04 示例：

```bash
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb
sudo apt update
sudo apt install -y dotnet-sdk-8.0 aspnetcore-runtime-8.0
```

Ubuntu 24.04 示例：

```bash
wget https://packages.microsoft.com/config/ubuntu/24.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb
sudo apt update
sudo apt install -y dotnet-sdk-8.0 aspnetcore-runtime-8.0
```

验证：

```bash
dotnet --info
```

## 7. 拉取项目代码

```bash
cd ~
git clone https://github.com/Wayneliu2040/AI_ART_GALLERY.git
cd AI_ART_GALLERY/backend
```

如果仓库已经存在：

```bash
cd ~/AI_ART_GALLERY
git pull origin main
cd backend
```

## 8. 本机编译与发布后端

在 VM 的 `backend` 目录执行：

```bash
dotnet restore
dotnet build -c Release
dotnet publish -c Release -o /var/www/ai-art-gallery-api
```

创建目录权限：

```bash
sudo mkdir -p /var/www/ai-art-gallery-api
sudo chown -R $USER:$USER /var/www/ai-art-gallery-api
dotnet publish -c Release -o /var/www/ai-art-gallery-api
```

## 9. 配置生产环境变量

直接在 `systemd` service 中配置项目所需值。

需要准备：

```text
ConnectionStrings__DefaultConnection
Jwt__Issuer
Jwt__Audience
Jwt__SecretKey
Jwt__ExpiryMinutes
AzureStorage__ConnectionString
AzureStorage__ContainerName
Cors__AllowedOrigins__0
ASPNETCORE_URLS
ASPNETCORE_ENVIRONMENT
```

JWT secret 至少 32 字符，例如：

```text
replace-this-with-a-long-random-secret-key-123456
```

不要把真实连接字符串和密钥提交到 GitHub。

## 10. 创建 systemd 服务

创建服务文件：

```bash
sudo nano /etc/systemd/system/ai-art-gallery-api.service
```

写入以下内容，并替换占位符：

```ini
[Unit]
Description=AI Art Gallery API
After=network.target

[Service]
WorkingDirectory=/var/www/ai-art-gallery-api
ExecStart=/usr/bin/dotnet /var/www/ai-art-gallery-api/AIArtGallery.Api.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=ai-art-gallery-api
User=<vm-user>
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://0.0.0.0:8080
Environment=ConnectionStrings__DefaultConnection=Server=tcp:<server>.database.windows.net,1433;Initial Catalog=AIArtGalleryDb;Persist Security Info=False;User ID=<user>;Password=<password>;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
Environment=Jwt__Issuer=AIArtGallery.Api
Environment=Jwt__Audience=AIArtGallery.Frontend
Environment=Jwt__SecretKey=<a-long-random-secret-at-least-32-characters>
Environment=Jwt__ExpiryMinutes=120
Environment=AzureStorage__ConnectionString=<azure-storage-connection-string>
Environment=AzureStorage__ContainerName=ai-images
Environment=Cors__AllowedOrigins__0=https://<your-static-web-app>.azurestaticapps.net

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable ai-art-gallery-api
sudo systemctl start ai-art-gallery-api
```

查看状态：

```bash
sudo systemctl status ai-art-gallery-api
```

查看日志：

```bash
sudo journalctl -u ai-art-gallery-api -n 100 --no-pager
```

持续查看日志：

```bash
sudo journalctl -u ai-art-gallery-api -f
```

## 11. 后端独立测试

### 11.1 健康检查

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

### 11.2 Swagger

浏览器访问：

```text
http://<vm-public-ip>:8080/swagger
```

如果 Swagger 能打开，说明 API 服务、端口和 NSG 基本正常。

### 11.3 注册用户

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

### 11.4 登录

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

### 11.5 查询图片列表

```powershell
Invoke-RestMethod -Uri "http://<vm-public-ip>:8080/api/images"
```

### 11.6 上传图片

建议先用 Swagger 测试：

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

- Blob container 中是否出现图片
- SQL `Images` 表中是否出现 metadata
- `GET /api/images` 是否返回新图片
- 前端是否能显示 Blob URL

## 12. 更新后端代码后的重新部署

每次 GitHub 有新代码后，在 VM 上执行：

```bash
cd ~/AI_ART_GALLERY
git pull origin main
cd backend
dotnet restore
dotnet build -c Release
dotnet publish -c Release -o /var/www/ai-art-gallery-api
sudo systemctl restart ai-art-gallery-api
sudo systemctl status ai-art-gallery-api
```

查看日志：

```bash
sudo journalctl -u ai-art-gallery-api -n 100 --no-pager
```

## 13. 和 Azure Static Web Apps 联调

前端生产环境需要：

```env
VITE_API_BASE_URL=https://<your-api-domain>/api
VITE_ENABLE_MOCKS=false
```

重要提醒：

- Azure Static Web Apps 是 HTTPS
- 如果后端只有 `http://<vm-public-ip>:8080/api`，浏览器可能会拦截 mixed content
- 最终联调建议给后端配置 HTTPS 域名

## 14. 可选：Nginx + HTTPS

后端 HTTP 测试通过后，再考虑配置 Nginx 和 HTTPS。

安装 Nginx：

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

Nginx 反向代理目标：

```text
http://127.0.0.1:8080
```

最终 API 地址建议类似：

```text
https://api.example.com/api
```

没有域名时，可以先完成后端独立测试，再处理 HTTPS 和前端真实联调。

## 15. 常见问题排查

### 15.1 `/health` 访问不到

检查：

```bash
sudo systemctl status ai-art-gallery-api
sudo journalctl -u ai-art-gallery-api -n 100 --no-pager
```

再检查：

- VM NSG 是否开放 8080
- `ASPNETCORE_URLS` 是否为 `http://0.0.0.0:8080`
- 服务是否启动成功

### 15.2 Swagger 能打开，但注册失败

重点检查：

- Azure SQL connection string 是否正确
- SQL 防火墙是否允许 VM 访问
- `Users` 表是否已经创建
- 日志里是否有 SQL 登录失败

### 15.3 上传失败

重点检查：

- `AzureStorage__ConnectionString`
- `AzureStorage__ContainerName`
- Blob container 是否存在
- Storage access key 是否完整
- 上传文件是否超过 20 MB

### 15.4 上传成功但图片不显示

通常是 Blob 读取权限问题。当前项目保存的是 Blob URL，前端直接读取 URL。

解决方向：

- MVP 阶段允许 Blob 匿名读取
- 或后续改为 SAS URL
- 或后续通过 API 代理图片读取

### 15.5 前端调用 API 报 CORS

检查：

```text
Cors__AllowedOrigins__0=https://<your-static-web-app>.azurestaticapps.net
```

必须和浏览器地址栏里的前端 origin 完全一致。

### 15.6 前端调用 API 报 mixed content

原因：

```text
HTTPS frontend -> HTTP backend
```

解决：

- 给后端配置 HTTPS
- 或先只用 Swagger/Postman 独立测试后端

## 16. 建议测试顺序

1. Azure SQL 建库并执行 schema
2. Azure Blob 创建 `ai-images`
3. Azure VM 安装 Git 和 .NET 8
4. VM 拉取 GitHub 代码
5. `dotnet publish` 发布后端
6. 配置 `systemd` 服务
7. 测试 `/health`
8. 测试 `/swagger`
9. 测试 register/login
10. 测试 image list
11. 测试 image upload
12. 检查 SQL 和 Blob 是否有真实数据
13. 配置 HTTPS 后再联调 Azure Static Web Apps

## 17. 部署完成检查清单

- [ ] VM 可以 SSH 登录
- [ ] VM NSG 开放 8080
- [ ] .NET 8 SDK / Runtime 已安装
- [ ] Azure SQL schema 已执行
- [ ] Blob container `ai-images` 已创建
- [ ] `systemd` 服务已创建
- [ ] API 服务正在运行
- [ ] `/health` 正常
- [ ] `/swagger` 正常
- [ ] `POST /api/auth/register` 正常
- [ ] `POST /api/auth/login` 正常
- [ ] `GET /api/images` 正常
- [ ] `POST /api/images` 正常
- [ ] API 可以写入 Azure SQL
- [ ] API 可以上传图片到 Blob
- [ ] 前端生产环境已关闭 mock：`VITE_ENABLE_MOCKS=false`
- [ ] 前端 `VITE_API_BASE_URL` 指向真实 API
- [ ] 如需前端联调，后端 API 已支持 HTTPS

## 18. 官方参考

- Install .NET on Ubuntu: <https://learn.microsoft.com/en-us/dotnet/core/install/linux-ubuntu>
- ASP.NET Core Linux deployment with Nginx: <https://learn.microsoft.com/aspnet/core/host-and-deploy/linux-nginx>
- Azure SQL network access controls: <https://learn.microsoft.com/en-us/azure/azure-sql/database/network-access-controls-overview>
- Azure Blob Storage container management: <https://learn.microsoft.com/en-us/azure/storage/blobs/blob-containers-portal>
- Azure Network Security Groups: <https://learn.microsoft.com/en-us/azure/virtual-network/manage-network-security-group>

