# GitHub 上传与 Azure Static Web Apps 部署操作手册

本文档用于把当前项目 `AI_ART_GALLERY` 上传到 GitHub，并通过 Azure Static Web Apps 从 GitHub 自动构建和部署前端。

当前项目路径：

```powershell
D:\workspace\jupyterdir\react\AI_ART_GALLERY
```

前端项目路径：

```powershell
D:\workspace\jupyterdir\react\AI_ART_GALLERY\frontend
```

## 1. 推荐部署流程

推荐流程如下：

1. 在本机安装并配置 Git。
2. 在本机安装并登录 GitHub CLI。
3. 让 Codex 在项目目录中初始化 Git 仓库。
4. 让 Codex 提交代码并推送到 GitHub。
5. 在 Azure Portal 创建 Azure Static Web Apps。
6. 选择 GitHub 仓库和 `main` 分支。
7. Azure 自动生成 GitHub Actions workflow。
8. 每次推送到 GitHub 后，Azure Static Web Apps 自动重新部署。

这个流程适合本项目，因为前端在 `frontend/` 目录中，属于 monorepo 结构。Azure Static Web Apps 官方文档说明，`app_location` 是相对于 GitHub 仓库根目录的前端源代码路径，`output_location` 是构建输出目录，并且通常相对于 `app_location`。

官方参考：

- Azure Static Web Apps build configuration: https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration
- Azure Static Web Apps portal quickstart: https://learn.microsoft.com/en-us/azure/static-web-apps/get-started-portal
- GitHub CLI authentication: https://cli.github.com/manual/gh_auth_login

## 2. 本机需要的软件

你需要在 Windows 主机上准备：

- Git
- GitHub CLI，命令是 `gh`
- 一个 GitHub 账号
- 一个 Azure 账号
- Docker Desktop，可选，用于本地预览前端

检查 Git：

```powershell
git --version
```

检查 GitHub CLI：

```powershell
gh --version
```

如果没有安装 GitHub CLI，可以去这里安装：

```text
https://cli.github.com/
```

## 3. 给 Codex 配置 GitHub 上传能力

最推荐的方式是使用 GitHub CLI，而不是把 GitHub 密码或 Token 发给 Codex。

### 3.1 你需要手动完成一次 GitHub CLI 登录

在 Windows PowerShell 中执行：

```powershell
gh auth login
```

推荐选择：

- `GitHub.com`
- `HTTPS`
- `Login with a web browser`
- 如果询问是否认证 Git 操作，选择 `Yes`

GitHub CLI 官方说明：`gh auth login` 默认使用基于浏览器的登录流程，完成后会把认证信息保存到系统凭据存储中。这样 Codex 后续运行 `git push` 或 `gh repo create` 时，就可以使用你本机已经授权好的 GitHub 登录状态。

登录后检查：

```powershell
gh auth status
```

### 3.2 Codex 可以帮你做什么

完成 `gh auth login` 后，你可以让我直接执行这些任务：

- 初始化 Git 仓库
- 创建 `.gitignore`
- 检查哪些文件会被提交
- 创建第一次 commit
- 创建 GitHub 远程仓库
- 添加 `origin`
- 推送到 GitHub
- 后续继续提交和推送修改

你只需要告诉我仓库名和可见性，例如：

```text
请把项目上传到 GitHub，仓库名 AI_ART_GALLERY，设为 private。
```

或者：

```text
请把项目上传到 GitHub，仓库名 AI_ART_GALLERY，设为 public。
```

### 3.3 Codex 之后会执行的典型命令

如果你让 Codex 创建 GitHub 仓库并推送，通常会执行：

```powershell
cd D:\workspace\jupyterdir\react\AI_ART_GALLERY
git init
git add .
git commit -m "Initial AI Art Gallery project"
git branch -M main
gh repo create AI_ART_GALLERY --private --source . --remote origin --push
```

如果你已经在 GitHub 网站上手动创建好了仓库，通常会执行：

```powershell
cd D:\workspace\jupyterdir\react\AI_ART_GALLERY
git init
git add .
git commit -m "Initial AI Art Gallery project"
git branch -M main
git remote add origin https://github.com/<your-github-user-or-org>/AI_ART_GALLERY.git
git push -u origin main
```

注意：不要把 GitHub 密码、Personal Access Token、Azure SQL 密码、Blob Storage Key 直接发给 Codex 或写入普通代码文件。

## 4. 上传前检查清单

上传到 GitHub 前建议检查：

- 根目录存在 `.gitignore`
- 不上传 `node_modules/`
- 不上传 `frontend/.env`
- 不上传真实 Azure SQL 密码
- 不上传真实 Azure Storage Account Key
- `frontend/.env.example` 可以上传，因为它是模板
- `backend/appsettings.json` 当前只应该保留占位符，不应写真实密码

本项目已经新增根目录 `.gitignore`，会忽略常见构建产物、本地环境文件和本地密钥文件。

建议你在上传前让我执行：

```text
请检查一下准备提交到 GitHub 的文件列表。
```

我会运行：

```powershell
git status --short
```

并帮你判断是否有不该上传的文件。

## 5. Azure Static Web Apps 部署设置

进入 Azure Portal：

```text
https://portal.azure.com/
```

创建资源：

1. 搜索 `Static Web Apps`
2. 点击 `Create`
3. 填写基础信息
4. Source 选择 `GitHub`
5. 登录并授权 GitHub
6. 选择你的 GitHub 组织或个人账号
7. Repository 选择 `AI_ART_GALLERY`
8. Branch 选择 `main`

建议配置：

| 配置项 | 建议值 |
| --- | --- |
| Name | `ai-art-gallery-frontend` |
| Plan type | `Free`，学生项目足够 |
| Source | `GitHub` |
| Organization | 你的 GitHub 用户名或组织 |
| Repository | `AI_ART_GALLERY` |
| Branch | `main` |
| Build Presets | `React` 或 `Custom` |
| App location | `/frontend` |
| Api location | 留空 |
| Output location | `dist` |

本项目的后端是部署到 Azure VM 的 `.NET Web API`，不是 Azure Static Web Apps 内置 Functions API，所以 `Api location` 这里先留空。

## 6. Azure 生成的 GitHub Actions Workflow

Azure Static Web Apps 创建成功后，会自动在 GitHub 仓库中生成类似下面的 workflow 文件：

```text
.github/workflows/azure-static-web-apps-xxxx.yml
```

核心配置应接近：

```yaml
app_location: "/frontend"
api_location: ""
output_location: "dist"
```

如果 Azure 自动生成的值不对，可以让我帮你修改这个 workflow 文件。

你可以这样告诉我：

```text
Azure 生成了 GitHub Actions 文件，请帮我检查并改成适合当前项目的配置。
```

## 7. 前端环境变量说明

当前前端是 Vite 项目，环境变量以 `VITE_` 开头。

目前建议第一次部署先使用 mock 模式，让页面先成功显示：

```text
VITE_ENABLE_MOCKS=true
```

后续接真实后端 API 时，需要：

```text
VITE_ENABLE_MOCKS=false
VITE_API_BASE_URL=https://<your-api-domain>/api
```

重要说明：Vite 的 `VITE_*` 变量通常是在前端构建阶段注入的，不是普通服务器运行时变量。也就是说，如果你在 Azure Static Web Apps 里修改了这些变量，通常需要重新触发一次构建部署。后续如果你希望运行时动态切换 API 地址，我们可以再加一个 `runtime-config.json` 方案。

## 8. 第一次部署后的验证步骤

Azure Static Web Apps 创建完成后：

1. 进入 GitHub 仓库
2. 打开 `Actions`
3. 查看 Azure Static Web Apps workflow 是否成功
4. 回到 Azure Static Web Apps 资源页面
5. 打开 Overview 页面里的 URL
6. 检查页面是否能加载
7. 检查路由刷新是否正常，例如直接访问 `/gallery`
8. 检查登录、Explore、User Center、Upload Image 页面是否正常显示

如果 GitHub Actions 失败，把失败日志复制给我，我可以继续帮你定位。

## 9. 常见问题

### 9.1 Azure 找不到仓库

可能原因：

- Azure Static Web Apps 没有获得 GitHub 授权
- 你没有选对 GitHub organization
- 仓库是 private，但授权范围不包含它

处理方式：

- 回到 GitHub Settings
- 找到 Applications
- 找到 Azure Static Web Apps
- 确认授权访问目标仓库

### 9.2 GitHub Actions build 失败

常见原因：

- `app_location` 写错
- `output_location` 写错
- `package.json` 不在 Azure 配置的 app 路径下
- `npm run build` 报错

本项目推荐：

```yaml
app_location: "/frontend"
api_location: ""
output_location: "dist"
```

### 9.3 页面部署成功但刷新路由 404

本项目已经在：

```text
frontend/public/staticwebapp.config.json
```

配置了 SPA fallback。正常情况下构建后该文件会被复制进 `dist`，用于支持 React Router 页面刷新。

### 9.4 前端能打开但 API 调用失败

可能原因：

- 当前还是 mock 模式
- `VITE_API_BASE_URL` 没有在构建时配置
- 后端 Azure VM API 没有启动
- 后端 CORS 没有允许 Static Web Apps 域名
- 后端 HTTPS / 端口 / 防火墙没有配置好

第一次 Azure Static Web Apps 测试建议先不接后端，只验证前端页面可部署。

## 10. 明天推荐操作顺序

建议你明天按这个顺序走：

1. 在 Windows 上确认 `git --version`
2. 在 Windows 上确认 `gh --version`
3. 执行 `gh auth login`
4. 执行 `gh auth status`
5. 让我检查 Git 提交文件列表
6. 让我初始化 Git 仓库并创建第一次 commit
7. 让我创建 GitHub repo 并 push
8. 你进入 Azure Portal 创建 Static Web Apps
9. 选择 GitHub repo `AI_ART_GALLERY`
10. 设置 `app_location=/frontend`
11. 设置 `api_location` 为空
12. 设置 `output_location=dist`
13. 等 GitHub Actions 完成
14. 打开 Azure Static Web Apps URL 测试页面
15. 把任何报错截图或日志发给我

## 11. 给 Codex 的后续指令模板

你可以直接复制下面这些话给我：

```text
我已经完成 gh auth login，请你检查项目准备提交到 GitHub 的文件列表。
```

```text
请初始化 Git 仓库，创建第一次 commit，但先不要 push。
```

```text
请创建 GitHub 仓库 AI_ART_GALLERY，设为 private，并把当前项目 push 到 main 分支。
```

```text
Azure Static Web Apps 生成了 workflow 文件，请你检查 app_location、api_location、output_location 是否正确。
```

```text
GitHub Actions 部署失败了，这是日志：<粘贴日志>，请帮我修。
```

## 12. 安全原则

请记住：

- 不要把真实数据库密码写进 GitHub 仓库。
- 不要把 Azure Blob Storage Account Key 写进 GitHub 仓库。
- 不要把 Personal Access Token 发给 Codex。
- 优先使用 `gh auth login` 让 GitHub CLI 保存认证。
- Azure 线上密钥应放在 Azure VM 环境变量、Azure App Settings 或后续的 Key Vault 中。

这样配置后，Codex 可以帮你处理代码提交和推送，而你只需要负责浏览器里的 GitHub / Azure 授权确认和 Azure 资源配置。
