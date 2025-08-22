# PetShopManagement 开发指南

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL (用于API服务)

### 安装依赖

```bash
pnpm install
```

### 启动开发环境

```bash
# 启动所有应用（并行）
pnpm dev

# 或者单独启动
pnpm --filter @petshop/api dev
pnpm --filter @petshop/web dev
```

## 项目架构说明

### Monorepo 结构

这是一个使用 pnpm workspace 管理的 monorepo 项目：

- **`apps/api`**: 后端API服务 (Express + Prisma + Supabase)
- **`apps/web`**: 前端Web应用 (React + Vite + MUI)
- **`packages/shared`**: 共享类型定义和工具函数
- **`packages/ui`**: 共享UI组件库

### 开发流程

#### 1. 创建新功能

```bash
# 1. 创建功能分支
git checkout -b feat/pet-management

# 2. 在相应包中开发
# - API功能: apps/api/src/
# - Web功能: apps/web/src/
# - 共享类型: packages/shared/src/

# 3. 提交代码（遵循提交规范）
git commit -m "feat(pets): add pet management functionality"
```

#### 2. 类型共享

```typescript
// 在 packages/shared/src/types/ 中定义类型
export interface Pet {
  id: string
  name: string
  species: PetSpecies
  age: number
  ownerId: string
}

// 在其他包中使用
import { Pet } from '@petshop/shared'
```

#### 3. 组件共享

```typescript
// 在 packages/ui/src/ 中定义组件
export const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  // 组件实现
}

// 在Web应用中使用
import { PetCard } from '@petshop/ui'
```

## 代码规范执行

### 自动检查

项目配置了以下工具来自动执行代码规范：

#### ESLint

```bash
# 检查所有包
pnpm lint

# 自动修复
pnpm lint:fix
```

#### Prettier

```bash
# 格式化代码
pnpm format
```

#### TypeScript 类型检查

```bash
# 检查所有包
pnpm type-check
```

### 提交前检查

项目使用 Husky + lint-staged 在提交前自动检查：

```bash
# 提交代码时会自动执行
git commit -m "feat: add new feature"
# 自动运行: lint, type-check, format
```

## 数据库开发

### Prisma 使用

```bash
# 生成Prisma客户端
pnpm --filter @petshop/api db:generate

# 推送数据库变更
pnpm --filter @petshop/api db:push

# 打开Prisma Studio
pnpm --filter @petshop/api db:studio
```

### 数据库迁移

```bash
# 创建迁移
npx prisma migrate dev --name add_pet_table

# 应用迁移
npx prisma migrate deploy
```

## 前端开发

### 组件开发

```typescript
// 1. 在 apps/web/src/components/ 中创建组件
// 2. 使用 TypeScript 定义 Props 接口
// 3. 遵循组件设计原则（见代码规范）
// 4. 编写测试用例
```

### 状态管理

```typescript
// 使用 React Query 进行服务端状态管理
const { data: pets, isLoading } = useQuery({
  queryKey: ['pets'],
  queryFn: () => petApi.getAll(),
})

// 使用 React Context 进行客户端状态管理
const { user, login, logout } = useAuth()
```

## 后端开发

### API 开发

```typescript
// 1. 在 apps/api/src/routes/ 中定义路由
// 2. 在 apps/api/src/controllers/ 中实现控制器
// 3. 在 apps/api/src/services/ 中实现业务逻辑
// 4. 在 apps/api/src/middleware/ 中添加中间件
```

### 认证中间件

```typescript
// 使用 Supabase 进行认证
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// 在中间件中验证JWT token
export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: '未授权' })
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)
    if (error) throw error

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Token无效' })
  }
}
```

## 测试策略

### 单元测试

```bash
# 运行测试
pnpm test

# 运行特定包的测试
pnpm --filter @petshop/api test
```

### 测试文件组织

```
src/
├── __tests__/           # 测试文件目录
│   ├── components/      # 组件测试
│   ├── services/        # 服务测试
│   └── utils/           # 工具函数测试
└── __mocks__/           # Mock文件目录
```

## 部署

### 构建

```bash
# 构建所有包
pnpm build

# 构建特定包
pnpm --filter @petshop/api build
pnpm --filter @petshop/web build
```

### 环境变量

```bash
# API服务环境变量
# apps/api/.env
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."

# Web应用环境变量
# apps/web/.env
VITE_API_URL="http://localhost:3001"
VITE_SUPABASE_URL="https://..."
VITE_SUPABASE_ANON_KEY="..."
```

## 常见问题

### 1. 依赖安装失败

```bash
# 清理缓存
pnpm store prune
rm -rf node_modules
pnpm install
```

### 2. 类型错误

```bash
# 重新生成类型
pnpm --filter @petshop/shared build
pnpm type-check
```

### 3. 数据库连接问题

```bash
# 检查Prisma配置
pnpm --filter @petshop/api db:generate
pnpm --filter @petshop/api db:push
```

## 贡献指南

### 代码审查清单

在提交PR前，请确保：

- [ ] 代码符合项目规范
- [ ] 通过了所有测试
- [ ] 通过了ESLint检查
- [ ] 通过了TypeScript类型检查
- [ ] 提交消息符合规范
- [ ] 添加了必要的文档

### 提交消息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

示例：

```
feat(pets): add pet search functionality

- Implement search by name, species, and age
- Add pagination support
- Include owner information in search results

Closes #123
```

---

**注意**: 本指南应与 `CODING_STANDARDS.md` 配合使用，确保代码质量和一致性。
