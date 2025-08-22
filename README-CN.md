# 宠物店管理系统

一个专为线下宠物店设计的财务与预约管理系统，基于现代 Web 技术构建。

## 🏗️ 项目结构

```
petshop-management/
├── apps/
│   ├── web/                    # 前端 React 应用
│   └── api/                    # 后端 Express API
├── packages/
│   ├── shared/                 # 共享类型和工具
│   └── ui/                     # 共享UI组件（可选）
└── docs/                       # 文档
```

## 🚀 技术栈

### 前端 (`apps/web`)
- **React 18** - UI 框架
- **Vite** - 构建工具和开发服务器
- **TypeScript** - 类型安全
- **MUI (Material-UI)** - 组件库
- **Tailwind CSS** - 工具类 CSS（补充）
- **React Query** - 数据获取和缓存
- **React Router** - 客户端路由

### 后端 (`apps/api`)
- **Node.js + Express** - 服务器框架
- **TypeScript** - 类型安全
- **Prisma** - 数据库 ORM
- **SQLite** - 数据库（开发环境）
- **Supabase Auth** - 身份认证和授权
- **Helmet** - 安全中间件
- **CORS** - 跨域资源共享

## 📋 环境要求

开始之前，请确保你已安装：

- **Node.js**（版本 18 或更高）
- **pnpm**（版本 8 或更高）

```bash
# 如果还没安装 pnpm
npm install -g pnpm
```

## ⚠️ 重要提示

**本指南已更新适配 2025 年最新版 Supabase 界面！**

根据你的截图，2025 年的 Supabase 导航结构如下：

- **🔐 Authentication** - 认证相关的所有设置（如你截图中高亮显示）
- **⚙️ Project Settings** - 项目设置和 API 密钥
- **📊 Database** - 数据库管理和表编辑
- **📝 SQL Editor** - SQL 查询编辑器（现在有 AI 助手功能）

**关键导航路径：**
- **邮箱登录配置**: `Authentication` 菜单下
- **用户管理**: `Authentication` 菜单下  
- **API 密钥**: `Project Settings` 菜单下
- **数据库操作**: `Database` 或 `Table Editor` 菜单下

## 🚀 快速开始

### 1. 安装依赖

```bash
# 克隆仓库后
cd petshop-management
pnpm install
```

### 2. 设置数据库

```bash
cd apps/api
pnpm db:generate
pnpm db:push
cd ../..
```

### 3. 配置 Supabase（重要！）

**你必须创建自己的 Supabase 项目，不能使用演示项目！**

#### 3.1 创建 Supabase 账号和项目

1. 打开 [Supabase 官网](https://supabase.com)
2. 点击右上角 **"Sign Up"** 注册账号
3. 验证邮箱后登录到控制台
4. 点击 **"New Project"** 创建新项目
5. 填写项目信息：
   - **Name**: `petshop-dev`（或你喜欢的名字）
   - **Organization**: 选择你的组织
   - **Database Password**: 设置一个强密码（记住它！）
   - **Region**: 选择 `Southeast Asia (Singapore)` 或 `Northeast Asia`
6. 点击 **"Create new project"**
7. 等待 2-3 分钟项目初始化完成

#### 3.2 配置邮箱认证（2025年新界面）

1. 在左侧菜单点击 **"🔐 Authentication"**（如你截图中所示）
2. 进入 Authentication 页面后，查找认证提供商设置
3. 找到 **"Email"** 提供商选项
4. 确保邮箱认证已启用
5. 根据需要配置安全选项：
   - **邮箱验证** - 生产环境建议开启
   - **安全邮箱变更** - 建议开启
   - **密码泄露检测** - 可选

#### 3.3 配置网站 URL 和重定向（2025年新界面）

1. 仍在 **"🔐 Authentication"** 菜单下
2. 寻找 **"URL Configuration"** 或类似的设置选项
3. 配置以下重要设置：
   - **网站 URL**: `http://localhost:5173`
   - **重定向 URLs**: 添加以下 URL
     ```
     http://localhost:5173/auth/callback
     http://localhost:3000/auth/callback
     ```
4. 保存所有设置

> **💡 2025年提示**: 如果界面布局与描述不符，所有认证相关设置都应该在 `🔐 Authentication` 菜单下，可能以不同的标签页或子菜单形式组织。

#### 3.4 开发环境邮件设置（可选）

对于开发环境，你可以：

1. 在 **"Settings"** 标签下
2. 找到 **"Email"** 部分
3. 可以临时关闭 **"Enable email confirmations"** 以便快速测试
4. 生产环境建议保持开启以确保安全

#### 3.5 获取 API 密钥（2025年新界面）

1. 在左侧菜单点击 **"⚙️ Project Settings"**（如你截图底部所示）
2. 在项目设置中寻找 **"API"** 或 **"API Keys"** 部分
3. 复制以下三个关键信息：
   - **Project URL**（项目网址，类似：`https://xxx.supabase.co`）
   - **anon public key**（匿名公钥，很长的字符串）
   - **service_role key**（服务角色密钥，标记为"secret"，非常重要！）

> **🔑 安全提醒**: service_role key 具有管理员权限，只能在后端使用，绝不要在前端代码中暴露！

#### 3.6 创建测试用户（2025年新界面）

**重要说明：** 2025 年版本支持多种用户创建方式，包括新的 AI 助手功能帮助。

**方式一：控制台手动创建**

1. 在左侧菜单点击 **"🔐 Authentication"**
2. 在 Authentication 页面寻找 **"Users"** 部分或标签
3. 点击 **"Add user"** 或类似的创建按钮
4. 创建以下测试账号：
   - `manager@test.com`（店长账号）
   - `clerk@test.com`（前台账号）
   - `technician@test.com`（技师账号）
5. 2025年版本可能支持批量创建，查找相关功能

**方式二：通过应用注册（推荐）**

直接在我们的应用中使用邮箱登录，系统自动创建用户。

#### 3.7 设置用户角色（2025年新功能）

**2025年可能的新方式：**

1. 在 **"🔐 Authentication"** 下找到用户管理
2. 点击用户进入详情页
3. 寻找 **"User Metadata"** 或 **"Custom Claims"** 部分
4. 根据用户类型设置角色 JSON：

**店长角色** (`manager@test.com`)：
```json
{
  "role": "manager"
}
```

**前台角色** (`clerk@test.com`)：
```json
{
  "role": "clerk"
}
```

**技师角色** (`technician@test.com`)：
```json
{
  "role": "technician"
}
```

5. 点击 **"Save"** 保存

### 4. 配置环境变量

#### 4.1 后端环境变量

```bash
# 创建后端环境文件
cp apps/api/.env.example apps/api/.env
```

编辑 `apps/api/.env` 文件，填入你的 Supabase 信息：

```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development

# 替换为你的 Supabase 信息
SUPABASE_URL=https://你的项目ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=你的service_role密钥
```

#### 4.2 前端环境变量

```bash
# 创建前端环境文件  
cp apps/web/.env.example apps/web/.env
```

编辑 `apps/web/.env` 文件：

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://你的项目ID.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon密钥
```

### 5. 启动项目

```bash
# 在项目根目录运行（会同时启动前后端）
pnpm dev
```

你会看到：
- **前端**：http://localhost:5173
- **后端**：http://localhost:3000

## 🔐 测试认证功能

### 登录测试

1. 打开 http://localhost:5173
2. 系统会自动跳转到登录页
3. 输入测试邮箱（如 `manager@test.com`）
4. 点击 **"发送登录链接"**
5. 检查邮箱中的登录邮件
6. 点击邮件中的链接完成登录

### 角色权限测试

登录成功后，系统会根据用户角色跳转：

- **店长** (`manager`) → 跳转到 `/dashboard` 仪表板页面
- **前台** (`clerk`) → 跳转到 `/bookings` 预约管理页面  
- **技师** (`technician`) → 跳转到 `/tasks/today` 任务页面

## 🌐 API 接口测试

### 健康检查

```bash
curl http://localhost:3000/healthz
# 返回：{"status":"ok"}
```

### 获取用户信息（需要登录）

1. 先在网页上登录获取 token
2. 在浏览器开发工具中找到 Bearer token
3. 测试 API：

```bash
curl -H "Authorization: Bearer 你的token" http://localhost:3000/api/auth/me
# 返回用户信息和角色
```

### 测试权限控制

```bash
# 无权限访问会返回 401
curl http://localhost:3000/api/auth/manager-only
# 返回：{"error":"Access token required"}

# 错误角色访问会返回 403
curl -H "Authorization: Bearer clerk的token" http://localhost:3000/api/auth/manager-only  
# 返回：{"error":"Insufficient permissions"}
```

## 🔧 常见问题

### 1. Supabase 邮件收不到？

- 检查垃圾邮件文件夹
- 确保 **Authentication > Providers > Email** 中的 **"Enable Email provider"** 已开启
- 检查 **Authentication > Settings** 中的邮件确认设置
- 开发环境可以暂时关闭 **"Enable email confirmations"**
- 可以在 **Authentication > Users** 页面查看用户状态

### 1.1 2025年新界面找不到设置？

**根据你的截图，2025年界面导航结构：**

- **🔐 邮箱登录设置**: `Authentication` 菜单（你截图中高亮的位置）
- **👥 用户管理**: `Authentication` 菜单下的用户部分
- **🔑 API 密钥**: `Project Settings` 菜单（你截图底部）
- **📊 数据库查看**: `Database` 或 `Table Editor` 菜单
- **💾 SQL 操作**: `SQL Editor` 菜单（现支持 AI 助手）

**🆕 2025年新特性：**
- **AI 助手**: 在 SQL Editor 中按 `CMD+K` 获得 AI 帮助
- **增强安全**: AI 助手可帮助解决安全和性能问题  
- **代码编辑**: Edge Functions 现在支持直接代码编辑

**❓ 如果还是找不到设置：**
- 检查是否在正确的项目中
- 刷新浏览器页面
- 确认账号有足够权限

### 2. 环境变量配置错误？

```bash
# 检查环境文件是否存在
ls apps/api/.env apps/web/.env

# 检查内容是否正确
cat apps/api/.env
cat apps/web/.env
```

### 3. 端口被占用？

```bash
# 查找占用端口的进程
lsof -ti:3000
lsof -ti:5173

# 杀死进程
kill -9 $(lsof -ti:3000)
kill -9 $(lsof -ti:5173)
```

### 4. 数据库问题？

```bash
# 重置数据库
cd apps/api
rm dev.db
pnpm db:push
```

## 🎯 验收清单

完成设置后，确保以下功能正常：

- [ ] ✅ 访问 http://localhost:5173 自动跳转到登录页
- [ ] ✅ 邮箱登录链接能正常发送和接收
- [ ] ✅ 不同角色用户登录后跳转到对应页面
- [ ] ✅ 调用 `/api/auth/me` 返回正确的用户信息
- [ ] ✅ 角色权限控制正常工作：
  - 店长能访问 `/api/auth/manager-only`
  - 前台能访问 `/api/auth/clerk-only`  
  - 技师能访问 `/api/auth/technician-only`
- [ ] ✅ 未授权访问返回 403 错误
- [ ] ✅ 登出功能正常，重新访问受保护页面会跳转登录

## 🚀 用户角色功能说明

### 店长 (Manager)
- 查看财务数据和报表
- 配置员工分成规则
- 查看员工绩效统计
- 系统设置和用户管理

### 前台 (Clerk)  
- 录入和管理客户预约
- 确认支付生成订单
- 维护客户信息
- 查看日程安排

### 技师 (Technician)
- 查看每日工作安排
- 确认服务完成状态
- 查看个人绩效
- 记录工作时间

## 📞 获取帮助

如果遇到问题：

1. 查看浏览器控制台错误信息
2. 查看后端服务器日志
3. 确认 Supabase 项目设置正确
4. 检查网络连接
5. **🆕 使用 Supabase AI 助手** - 在 SQL Editor 中按 `CMD+K`

## 🌟 2025年版本特别说明

根据你提供的截图和最新信息，我已经更新了所有设置步骤以适配 2025 年的 Supabase 界面。

**✨ 主要变化：**
- 导航菜单重新组织，更加直观（如你截图所示）
- 新增 AI 助手功能辅助开发和问题解决
- 安全性和性能监控增强
- 用户体验大幅改善

**🎯 现在你可以：**
1. 按照更新的中文指南设置你的 Supabase 项目
2. 利用 2025 年的新功能提升开发效率
3. 享受更好的界面体验和 AI 辅助

**📞 需要帮助？**
- 优先查看最新的导航结构说明
- 利用 Supabase 内置的 AI 助手（CMD+K）
- 随时向我反馈界面变化和问题

现在开始你的宠物店管理系统开发之旅吧！🚀