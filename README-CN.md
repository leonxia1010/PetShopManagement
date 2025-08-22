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

**本指南已更新适配 2024 年最新版 Supabase 界面！**

如果你看到的 Supabase 控制台界面与说明不完全一致，请参考以下重点：

- **Authentication > Providers** - 这里配置邮箱登录
- **Authentication > Settings** - 这里配置 URL 和邮件确认
- **Settings > API** - 这里获取 API 密钥
- **Authentication > Users** - 这里管理用户和角色

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

#### 3.2 配置邮箱认证提供商

1. 在左侧菜单点击 **"Authentication"**
2. 点击 **"Providers"** 标签
3. 找到 **"Email"** 提供商部分
4. 确保 **"Enable Email provider"** 开关已开启（如你截图所示）
5. 其他安全选项可根据需要调整：
   - **"Secure email change"** - 建议开启
   - **"Secure password change"** - 可选
   - **"Prevent use of leaked passwords"** - 可选

#### 3.3 配置网站 URL 和重定向

1. 在 **"Authentication"** 页面，点击 **"URL Configuration"** 标签
2. 或者点击 **"Settings"** 标签
3. 找到以下设置并填入：
   - **"Site URL"**: `http://localhost:5173`
   - **"Redirect URLs"**: 添加以下两个 URL
     ```
     http://localhost:5173/auth/callback
     http://localhost:3000/auth/callback
     ```
4. 点击 **"Save"** 保存设置

#### 3.4 开发环境邮件设置（可选）

对于开发环境，你可以：

1. 在 **"Settings"** 标签下
2. 找到 **"Email"** 部分
3. 可以临时关闭 **"Enable email confirmations"** 以便快速测试
4. 生产环境建议保持开启以确保安全

#### 3.5 获取 API 密钥

1. 在左侧菜单点击 **"Settings"**
2. 点击 **"API"** 标签
3. 复制以下三个信息：
   - **Project URL**（类似：`https://xxx.supabase.co`）
   - **anon public key**（很长的一串字符）
   - **service_role key**（另一串很长的字符，标记为"secret"）

#### 3.6 创建测试用户

**重要说明：** 新版 Supabase 推荐使用 Magic Link 或 OTP 方式，我们将通过登录流程创建用户。

**方式一：手动在控制台创建（可选）**

1. 在左侧菜单点击 **"Authentication"**
2. 点击 **"Users"** 标签
3. 点击 **"Add user"** 创建测试账号：
   - 输入邮箱：`manager@test.com`
   - 可以设置临时密码或留空
   - 点击 **"Create user"**
4. 重复创建 `clerk@test.com` 和 `technician@test.com`

**方式二：通过应用注册（推荐）**

直接在应用中使用邮箱登录，系统会自动创建用户。

#### 3.7 设置用户角色

对每个用户设置角色：

1. 点击用户邮箱进入详情页
2. 找到 **"Raw User Meta Data"** 部分
3. 点击右侧的编辑按钮（铅笔图标）
4. 根据用户类型输入对应的 JSON：

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

### 1.1 新版界面找不到设置？

**如果界面与说明不符，尝试以下位置：**

- **邮箱登录设置**: `Authentication → Providers → Email`  
- **URL 配置**: `Authentication → Settings → General` 或 `URL Configuration`
- **用户管理**: `Authentication → Users`
- **API 密钥**: `Settings → API`
- **邮件模板**: `Authentication → Email Templates`

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

现在你可以开始开发宠物店管理系统了！🎉