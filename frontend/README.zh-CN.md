# AI Art Gallery Frontend

这是 `AI Art Gallery` 项目的 React 前端，已经按 `Azure Static Web Apps` 的部署方式组织好了目录结构，并包含以下内容：

- React + Vite 前端工程
- React Router 单页路由
- 登录状态管理
- 登录页、注册页、画廊页、上传页、详情页、我的上传页
- `Azure Static Web Apps` 所需的 `staticwebapp.config.json`
- 本地 mock 模式，方便在后端未完成时先查看界面效果
- Docker 本地运行支持

## 1. 项目目录说明

当前前端关键目录如下：

- `public/staticwebapp.config.json`
- `src/App.jsx`
- `src/state/AuthContext.jsx`
- `src/services/api.js`
- `src/styles/app.css`
- `.env.example`
- `Dockerfile`
- `.dockerignore`

## 2. 本地通过 Docker 运行前端

目标：

- 不在 Windows 主机里直接安装 Node 依赖
- 通过 Docker Desktop 启动一个干净的前端环境
- 在 Windows 浏览器中访问页面

### 2.1 推荐硬件需求

- Windows 10 或 Windows 11
- CPU 双核及以上
- 内存至少 8 GB，推荐 16 GB
- 可用磁盘空间至少 5 GB

### 2.2 软件依赖

- Docker Desktop
- Git
- 浏览器，例如 Edge 或 Chrome
- 可选：Azure CLI

### 2.3 环境变量准备

进入前端目录：

```powershell
cd D:\workspace\jupyterdir\react\ai-image-share-frontend\frontend
Copy-Item .env.example .env
```

如果只是先查看界面效果，请保持：

```env
VITE_ENABLE_MOCKS=true
```

### 2.4 构建 Docker 镜像

```powershell
docker build -t ai-art-gallery-frontend .
```

### 2.5 启动容器

```powershell
docker run --rm -p 5173:5173 --name ai-art-gallery-frontend ai-art-gallery-frontend
```

浏览器访问：

```text
http://localhost:5173
```

### 2.6 Demo 账号

- Email：`demo@aiartgallery.app`
- Password：`Password123!`

## 3. 切换到真实后端 API

修改 `.env`：

```env
VITE_API_BASE_URL=https://your-api-domain/api
VITE_ENABLE_MOCKS=false
```

然后重新构建并重启容器：

```powershell
docker build -t ai-art-gallery-frontend .
docker run --rm -p 5173:5173 --name ai-art-gallery-frontend ai-art-gallery-frontend
```

## 4. 部署到 Azure Static Web Apps

推荐使用 Azure Portal 连接 GitHub 自动部署。

创建 Static Web App 时建议配置：

- App location：`/frontend`
- Api location：留空
- Output location：`dist`

本项目已经准备好：

- `public/staticwebapp.config.json`

它用于支持 React Router 的 SPA 路由回退。

## 5. 推荐操作顺序

1. 先在 Docker 中运行前端 mock 模式
2. 确认界面和路由没问题
3. 推送到 GitHub
4. 部署到 Azure Static Web Apps
5. 再接真实后端 API

## 6. 官方参考资料

- Azure Static Web Apps Quickstart:
  [https://learn.microsoft.com/en-us/azure/static-web-apps/get-started-portal](https://learn.microsoft.com/en-us/azure/static-web-apps/get-started-portal)
- Azure Static Web Apps Build Configuration:
  [https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration](https://learn.microsoft.com/en-us/azure/static-web-apps/build-configuration)
- Azure Static Web Apps Configuration:
  [https://learn.microsoft.com/en-us/azure/static-web-apps/configuration](https://learn.microsoft.com/en-us/azure/static-web-apps/configuration)
