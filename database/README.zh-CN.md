# AI Art Gallery 数据层

这个文件夹包含了 `AI Art Gallery` 项目与 `Azure SQL Database` 和 `Azure Blob Storage` 相关的代码和脚本。

## 已包含内容

- Azure SQL 建表脚本
- Azure SQL 示例数据脚本
- Azure Blob Storage 辅助脚本
- 数据层配置说明

## 目录结构

- `sql/001_create_schema.sql`
- `sql/002_seed_demo_data.sql`
- `storage/create-container.ps1`

## 使用方式

- 将 SQL 脚本运行到 Azure SQL Database
- 在 Azure Storage Account 中创建 Blob 容器
- 使用 `backend/` 里的后端 API 读写这些数据
