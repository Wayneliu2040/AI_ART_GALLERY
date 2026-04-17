# 开发计划总览

## 项目背景

本开发计划严格基于项目 proposal 制定，技术路线固定如下：

- 前端：React，部署在 Azure Static Web Apps
- 后端：.NET Web API，部署在 Azure Virtual Machine
- 数据库：Azure SQL Database
- 对象存储：Azure Blob Storage
- 代码协作：GitHub

项目目标是完成一个适合学生项目展示的最小可交付版本，要求系统功能完整、能够部署、并且便于答辩演示。

## 项目总体目标

最小交付版本建议支持以下能力：

- 用户注册与登录
- 上传 AI 生成图片
- 图片文件存储到 Azure Blob Storage
- 图片元数据存储到 Azure SQL Database
- 浏览全部图片
- 按关键词或标签进行搜索和筛选
- 查看图片详情
- 发表评论和点赞
- 前后端通过 RESTful API 解耦
- 最终系统部署在 Azure 上并可公开访问演示

## 推荐系统架构

### 客户端层

- 使用 React 实现前端
- 部署在 Azure Static Web Apps
- 负责登录、注册、画廊浏览、图片上传、详情展示、评论和点赞等交互

### 后端层

- 使用 .NET Web API 提供 RESTful 接口
- 部署在 Azure Virtual Machine
- 负责用户认证、业务逻辑、图片元数据管理、评论与点赞逻辑，以及与存储层的交互

### 数据层

- Azure SQL Database 存储：
  - 用户账号
  - 图片元数据
  - 评论
  - 点赞信息
- Azure Blob Storage 存储：
  - 图片文件本体
- 数据库中仅保存图片的访问 URL

## MVP 功能范围

### 必做功能

- 注册
- 登录
- 上传图片
- 浏览图片列表
- 搜索与筛选
- 查看图片详情
- 发表评论
- 点赞图片

### 可选增强功能

- 我的上传页面
- 编辑图片信息
- 删除图片
- 分页
- 热门排序
- 个人资料页面

## 建议的后端 API

### 认证模块

- `POST /api/auth/register`
- `POST /api/auth/login`

### 图片模块

- `GET /api/images`
- `GET /api/images/{id}`
- `POST /api/images`
- `GET /api/images/search?q=...&tag=...`

### 互动模块

- `POST /api/images/{id}/comments`
- `GET /api/images/{id}/comments`
- `POST /api/images/{id}/like`

## 建议的前端页面

- 登录页
- 注册页
- 画廊页
- 图片详情页
- 上传页
- 我的图片页

## Azure 资源清单

项目最终建议至少使用以下 Azure 资源：

- Azure Static Web Apps
- Azure Virtual Machine
- Azure SQL Database
- Azure Blob Storage
- Storage Account

可选但能增强完整度的服务：

- Azure Key Vault
- Application Insights

## 开发阶段划分

### 阶段 1：项目初始化

- 建立前后端项目结构
- 配置 GitHub 仓库和分支规范
- 明确环境变量和命名规则

### 阶段 2：数据层搭建

- 创建 Azure SQL Database
- 设计数据表结构和关系
- 创建 Azure Blob Storage 容器
- 验证 SQL 连接与 Blob 上传

### 阶段 3：后端核心 API

- 完成注册与登录
- 完成图片上传
- 完成图片列表与详情
- 完成搜索和筛选
- 完成评论与点赞

### 阶段 4：前端核心功能

- 登录和注册页面接入 API
- 画廊页接入真实图片数据
- 上传页接入上传接口
- 详情页接入评论和点赞接口

### 阶段 5：Azure 部署

- React 前端部署到 Azure Static Web Apps
- .NET API 部署到 Azure VM
- 云端接通 Azure SQL 和 Azure Blob Storage

### 阶段 6：测试与演示准备

- 功能测试
- 异常场景测试
- 前后端联调测试
- 答辩演示准备

## 关键风险点

该项目最容易卡住的部分主要有：

- Azure VM 上的 .NET API 部署配置
- Azure Blob Storage 的上传权限与访问控制
- 前后端跨域配置问题
- Azure SQL Database 的连接字符串和防火墙配置

这些问题建议尽早验证，不要留到项目最后阶段。

## 最终建议

对于学生项目，优先级建议如下：

1. 先打通完整的核心流程
2. 确保 Azure 服务使用符合 proposal
3. 保持架构简单清晰，便于答辩时说明

最重要的端到端链路是：

`React 前端 -> .NET API -> Azure SQL + Azure Blob -> Azure 部署`
