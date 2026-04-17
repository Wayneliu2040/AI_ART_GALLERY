# Azure 云端测试 TodoList

## 一、建议准备的数据规模

为了让明天在 Azure 上的测试更接近真实使用场景，同时又不至于准备工作量过大，建议先准备下面这套最小但足够用的测试数据规模。

### 1. 用户数据建议

建议先准备 **10 个测试用户**。

推荐分布：

- 1 个主测试账号
  - 用于你自己反复登录、上传、评论、点赞、查看用户中心
- 6 个普通用户账号
  - 用于制造不同作者上传的图片数据
- 2 个互动型账号
  - 用于制造评论和点赞行为
- 1 个空账号
  - 用于测试“还没有上传过任何图片”的场景

这样做的好处：

- 能覆盖“有内容用户”和“空用户”
- 能测试“我的上传”和“用户中心统计”
- 能测试评论、点赞、图片归属和多用户场景

## 二、10 个 Tag 建议

你当前已有的 4 个 Tag：

- `landscape`
- `cyberpunk`
- `portrait`
- `fantasy`

建议再扩展 6 个，总共凑成 10 个：

- `abstract`
- `anime`
- `sci-fi`
- `architecture`
- `nature`
- `surreal`

### 推荐理由

- `abstract`
  - 适合测试风格化、非写实类作品
- `anime`
  - 适合测试二次元风格作品，和 `portrait` 区分明显
- `sci-fi`
  - 和 `cyberpunk` 接近但不完全相同，适合做搜索与筛选对比
- `architecture`
  - 适合测试建筑、城市、空间类图片
- `nature`
  - 和 `landscape` 有关联，但更偏自然生态内容
- `surreal`
  - 适合测试概念化、梦境感、超现实提示词

## 三、建议准备的假数据规模

当前数据库里的示例假数据太少，不足以支持明天的完整 Azure 测试。建议至少准备下面这批 fake data。

### 1. 用户

- 10 个用户

### 2. 图片

建议至少准备 **40 张图片**

推荐分布：

- 每个 Tag 先准备 4 张
- 10 个 Tag × 4 张 = 40 张

如果你时间允许，最好提升到：

- **50 张图片**
- 即部分热门 Tag 多放 1 到 2 张

### 3. 评论

建议准备 **80 到 120 条评论**

推荐分布：

- 每张图片平均 2 到 3 条评论
- 有些图片 0 条评论
- 有些图片 5 条以上评论

这样能覆盖：

- 无评论场景
- 少量评论场景
- 多评论场景

### 4. 点赞

建议准备 **120 到 200 个点赞记录**

推荐分布：

- 每张图片平均 3 到 5 个点赞
- 热门图片 8 到 12 个点赞
- 冷门图片 0 到 1 个点赞

这样更有利于测试：

- 用户中心里的“获得点赞数”
- 图片卡片里的点赞显示
- 点赞接口是否会重复写入

## 四、建议补充的假数据内容

除了数量，假数据内容本身也要有一定层次，不要所有数据都长得太像。

建议你准备的数据内容包括：

### 1. 用户名和邮箱

建议使用英文、风格统一的测试账号，例如：

- `wayne@aiartgallery.app`
- `avery@aiartgallery.app`
- `jordan@aiartgallery.app`
- `taylor@aiartgallery.app`
- `morgan@aiartgallery.app`
- `casey@aiartgallery.app`
- `riley@aiartgallery.app`
- `skyler@aiartgallery.app`
- `harper@aiartgallery.app`
- `emptyuser@aiartgallery.app`

### 2. 图片标题

建议不要都叫类似 “Test Image 1”，而是尽量和 Tag 对应，例如：

- `Neon Rain District`
- `Silent Forest Shrine`
- `Scarlet Blade Hero`
- `Floating Glass City`
- `Dream Corridor`
- `Autumn Lake Reflection`
- `Orbital Research Tower`

### 3. Prompt

建议每个 Tag 至少有不同风格的 prompt，例如：

- 写实
- 插画
- 电影感
- 极简风
- 高细节风

### 4. 评论内容

建议准备几类评论：

- 正向评价
- 简短反馈
- 关于 prompt 的讨论
- 关于构图和风格的讨论

例如：

- `Great lighting and composition.`
- `This tag fits the image very well.`
- `The prompt detail is strong here.`
- `This would work nicely as a gallery hero image.`
- `I like the color balance and depth.`

## 五、明天正式做 Azure 测试前的准备事项

下面是明天你正式开始 Azure 测试前应该做的事情，建议按顺序执行。

## 1. Azure 资源检查

确认以下 Azure 资源已经准备好：

- Azure SQL Server
- Azure SQL Database
- Azure Storage Account
- Azure Blob Container
- Azure Virtual Machine
- Azure Static Web Apps

如果还没创建，要先补齐。

## 2. Azure SQL 配置检查

确认以下内容：

- Azure SQL 的数据库名已经确定
- 防火墙规则允许你的当前公网 IP 访问
- 数据库登录账号和密码可用
- 连接字符串可用

建议先做：

- 用 Azure Portal 的 Query Editor 或 SSMS / Azure Data Studio 测试是否能连上数据库

## 3. 执行数据库建表脚本

执行：

- `database/sql/001_create_schema.sql`

执行完成后检查是否成功创建：

- `Users`
- `Images`
- `Comments`
- `Likes`

## 4. 准备并导入假数据

当前建议不要只用现有的 `002_seed_demo_data.sql`，因为数据量太少。

明天测试前建议补一版更完整的 seed data，目标是：

- 10 个用户
- 40 到 50 张图片
- 80 到 120 条评论
- 120 到 200 个点赞

如果你来不及完整造数据，最低也建议做到：

- 6 个用户
- 20 张图片
- 30 条评论
- 50 个点赞

## 5. Azure Blob Storage 检查

确认以下内容：

- Blob 容器已经创建，例如 `ai-images`
- 容器访问策略已经确认
- 存储连接字符串可用
- 后端运行环境可以访问 Blob Storage

如果容器未创建，可以使用：

- `database/storage/create-container.ps1`

## 6. 后端配置检查

检查 `backend/appsettings.json` 或生产环境配置：

- `ConnectionStrings:DefaultConnection`
- `Jwt`
- `AzureStorage`
- `Cors`

特别注意：

- `CORS` 里要允许你的 Azure Static Web Apps 域名
- `Jwt:SecretKey` 不能继续用占位值

## 7. 后端部署到 Azure VM

确认以下事项：

- Azure VM 可以访问公网或至少可以访问 Azure SQL / Blob
- VM 已安装 .NET 8 运行环境
- 后端代码已发布到 VM
- API 进程能正常启动
- 后端端口已开放

建议先验证：

- `/health`
- Swagger 页面

## 8. 前端部署到 Azure Static Web Apps

确认以下内容：

- 前端代码已经推送到 GitHub
- Azure Static Web Apps 已正确绑定仓库和分支
- 构建配置正确：
  - `App location = /frontend`
  - `Api location = 空`
  - `Output location = dist`

## 9. 前端切换到真实 API

前端测试前，需要把 mock 关闭：

- `VITE_ENABLE_MOCKS=false`

同时把：

- `VITE_API_BASE_URL`

改成你 Azure VM 上后端 API 的真实地址。

## 10. 云端联调顺序

建议你明天按这个顺序测试：

1. 访问前端登录页
2. 测试注册
3. 测试登录
4. 测试图片列表加载
5. 测试图片详情
6. 测试用户中心统计
7. 测试上传图片
8. 测试评论
9. 测试点赞
10. 测试“我的上传 / Upload Image”页面展示

## 11. 明天必须记录的测试结果

建议你一边测一边记录这些内容：

- 每一步是否成功
- 前端报错截图
- 浏览器控制台报错
- 后端日志
- Azure VM 上的 API 报错
- Azure SQL 里是否成功写入数据
- Blob Storage 里是否成功上传文件

## 12. 明天最容易出问题的地方

明天最可能卡住的地方主要有：

- Azure SQL 防火墙
- 后端连接字符串错误
- Blob Storage 连接字符串错误
- CORS 配置错误
- 前端 API 地址配置错误
- JWT 认证不通过
- Azure VM 端口未放行

所以建议你明天优先先测这 4 件事：

1. 后端 `/health` 是否通
2. 后端是否能连 Azure SQL
3. 后端是否能传 Blob
4. 前端是否能成功调用后端登录接口

## 六、我给你的最终建议

如果目标是“明天先在 Azure 上把一整条链路跑通”，建议优先完成这条链路：

`注册 / 登录 -> 图片列表 -> 上传图片 -> 用户中心统计`

因为这条链路一旦通了，说明以下 4 个关键环节都已经打通：

- 前端
- 后端
- Azure SQL Database
- Azure Blob Storage

评论和点赞可以放在这条主链路跑通之后继续测。

## 七、明天执行优先级

### P0：必须完成

- Azure SQL 可连接
- Blob 容器可用
- 后端 API 启动成功
- 前端成功登录
- 成功读取图片列表
- 成功上传图片

### P1：最好完成

- 用户中心统计正确
- 图片详情页可打开
- 评论功能可用
- 点赞功能可用

### P2：时间够再做

- 补更多假数据
- 调整 UI 细节
- 做更完整的异常测试
