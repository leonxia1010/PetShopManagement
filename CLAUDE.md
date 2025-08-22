# CLAUDE.md

此文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目背景与上下文

### 业务领域
这是一个专为中国线下宠物店设计的**宠物店管理系统**。系统专注于财务管理和预约调度，帮助宠物店老板简化经营流程。

### 目标用户与角色
**店长：**
- 店铺老板或高级管理者
- 查看财务报表、收入分析
- 员工绩效管理
- 系统配置和设置

**前台：**
- 处理客户交互的前台工作人员
- 客户注册和档案管理
- 预约安排和排期
- 支付处理和订单生成
- 日常客户服务操作

**技师：**
- 宠物护理服务提供者（美容师、兽医等）
- 查看每日工作日程和预约
- 标记服务完成状态
- 追踪个人绩效指标
- 服务时间记录

### 业务需求
- **财务管理**：收入追踪、利润分析、员工分成计算
- **预约系统**：服务预订、排期、客户管理
- **角色访问控制**：不同用户类型的界面和权限
- **中文支持**：所有UI和文档使用中文
- **本地优先**：专为线下宠物店设计，非在线商城

### 技术背景
- 现代Web开发学习项目
- 演示带RBAC的全栈身份认证
- 使用现代TypeScript/React技术栈
- 集成Supabase用于认证和未来数据同步
- SQLite用于本地数据存储（开发阶段）

## 系统架构概览

这是一个使用Supabase认证和基于角色访问控制(RBAC)的monorepo宠物店管理系统。系统支持三种用户角色：店长、前台、技师。

### 核心组件

**后端 (`apps/api`)：**
- 基于TypeScript的Express.js API
- 通过JWT令牌验证的Supabase认证集成
- 保护端点的基于角色的中间件
- 使用SQLite数据库的Prisma ORM
- `/src/middleware/auth.ts`中的认证中间件处理令牌验证和角色提取

**前端 (`apps/web`)：**
- React 18配合Vite和TypeScript
- MUI (Material-UI)组件配合Tailwind CSS
- React Query用于数据获取
- 带保护路由的React Router
- Supabase客户端用于认证
- Auth上下文为应用提供认证状态

**认证流程：**
- Supabase邮箱OTP/魔法链接认证
- 角色存储在Supabase `auth.users.app_metadata.role`字段中
- 后端使用Supabase服务角色密钥验证JWT令牌
- 前端使用带`AuthGate`和角色特定`RoleGuard`组件的保护路由

### 用户角色与权限

- **店长**：访问`/dashboard`和`/api/auth/manager-only`
- **前台**：访问`/bookings`和`/api/auth/clerk-only` 
- **技师**：访问`/tasks/today`和`/api/auth/technician-only`

登录后基于用户元数据进行角色重定向。

## 开发命令

**根目录级别：**
```bash
pnpm dev                    # 并行启动前端和后端
pnpm build                  # 构建所有包
pnpm lint                   # 对所有包执行代码检查
pnpm format                 # 使用Prettier格式化代码
pnpm type-check            # TypeScript类型检查
```

**后端专用 (`apps/api`)：**
```bash
cd apps/api
pnpm dev                   # 启动API服务器（tsx watch热重载）
pnpm build                 # 编译TypeScript到dist/
pnpm db:generate           # 生成Prisma客户端
pnpm db:push              # 推送数据库架构变更
pnpm db:studio            # 打开Prisma Studio
```

**前端专用 (`apps/web`)：**
```bash
cd apps/web
pnpm dev                  # 启动Vite开发服务器
pnpm build                # 生产环境构建
pnpm preview              # 预览生产构建
```

## 环境配置

**后端 (`.env`)：**
- `DATABASE_URL` - SQLite数据库路径
- `SUPABASE_URL` - Supabase项目URL
- `SUPABASE_SERVICE_ROLE_KEY` - 后端操作的服务角色密钥
- `PORT` - API服务器端口（默认：3000）

**前端 (`.env`)：**
- `VITE_API_URL` - 后端API URL (http://localhost:3000)
- `VITE_SUPABASE_URL` - Supabase项目URL
- `VITE_SUPABASE_ANON_KEY` - Supabase匿名公钥

## 数据库架构

Prisma架构使用SQLite，包含`User`模型：
- `id` (cuid), `email` (唯一), `name`, `role` (默认："employee")
- 用户角色主要在Supabase认证元数据中管理，而非本地数据库

## 关键实现细节

- **认证中间件**：`/apps/api/src/middleware/auth.ts` - JWT验证和角色检查
- **保护路由**：`/api/auth/*`下的所有API路由需要认证
- **角色守卫**：前端使用`RoleGuard`组件根据用户角色显示/隐藏UI
- **错误处理**：缺失/无效令牌返回401，权限不足返回403

## 认证测试

1. 启动服务：`pnpm dev`
2. 访问 http://localhost:5173 （自动重定向到登录页）
3. 使用测试账户进行邮箱认证
4. 测试角色特定端点：
   - `/api/auth/me` - 返回用户信息
   - `/api/auth/manager-only` - 仅店长访问
   - `/api/auth/clerk-only` - 仅前台访问
   - `/api/auth/technician-only` - 仅技师访问

## Supabase用户角色设置

在Supabase SQL编辑器中通过SQL设置用户角色：
```sql
UPDATE auth.users 
SET app_metadata = jsonb_set(
  COALESCE(app_metadata, '{}'),
  '{role}',
  '"manager"'
)
WHERE email = 'manager@test.com';
```

`README-CN.md`中的中文文档提供了2025年界面的详细Supabase设置说明。

## 开发标准与代码质量

### SOLID原则
- **单一职责**：每个函数/类只有一个变更理由
- **开闭原则**：对扩展开放，对修改关闭
- **里氏替换**：派生组件保持预期行为
- **接口隔离**：创建具体的、专注的接口
- **依赖倒置**：依赖抽象而非具体实现

### TypeScript标准
- 使用严格的TypeScript配置
- 为参数和返回值定义明确类型
- 避免`any`类型 - 使用适当的类型定义
- 适当使用联合类型和泛型

### React最佳实践
- 使用带钩子的函数式组件
- 保持组件在200行以下
- 提取可重用逻辑的自定义钩子
- 对昂贵操作使用`useMemo`和`useCallback`

### 后端安全
- 总是验证和清理输入
- 使用参数化查询（Prisma处理）
- 实现适当的认证中间件
- 永不在响应中暴露敏感数据

### Git提交标准
**关键：提交信息中绝不提及AI协助**

使用conventional commits格式：
```
feat: add user role-based routing
fix: resolve auth token validation issue
refactor: extract auth middleware
docs: update setup instructions
```

### 代码组织
- 在功能文件夹中分组相关文件
- 组件和类型使用PascalCase
- 函数和变量使用camelCase
- 使用描述性和一致的文件名

### 性能指导
- 通过代码分割最小化包体积
- 适当使用数据库索引
- 实现适当的加载状态
- 监控API响应时间

### 错误处理
- 使用try/catch结构化错误处理
- 实现一致的错误响应格式
- 使用适当的HTTP状态码
- 记录带上下文的错误用于调试