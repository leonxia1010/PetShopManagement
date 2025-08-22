# PetShopManagement 代码规范

## 核心原则

### SOLID 原则

- **S** - 单一职责原则 (Single Responsibility Principle)
  - 每个类/函数只负责一个功能
  - 避免"上帝类"和"瑞士军刀函数"

- **O** - 开闭原则 (Open-Closed Principle)
  - 对扩展开放，对修改关闭
  - 使用接口和抽象类实现扩展

- **L** - 里氏替换原则 (Liskov Substitution Principle)
  - 子类必须能够替换父类
  - 保持继承关系的语义一致性

- **I** - 接口隔离原则 (Interface Segregation Principle)
  - 客户端不应依赖它不使用的接口
  - 接口要小而专注

- **D** - 依赖倒置原则 (Dependency Inversion Principle)
  - 依赖抽象而非具体实现
  - 高层模块不应依赖低层模块

## 代码风格

### 命名规范

- **变量/函数**: 使用 camelCase
- **常量**: 使用 UPPER_SNAKE_CASE
- **类/接口**: 使用 PascalCase
- **文件名**: 使用 kebab-case
- **数据库表/字段**: 使用 snake_case

### 函数设计

```typescript
// ✅ 好的函数设计
async function createPet(petData: CreatePetDto): Promise<Pet> {
  // 单一职责：只负责创建宠物
  // 参数明确：使用DTO类型
  // 返回值明确：Promise<Pet>
}

// ❌ 避免的设计
async function handlePetStuff(data: any, options?: any): Promise<any> {
  // 职责不清，类型模糊
}
```

### 错误处理

```typescript
// ✅ 统一的错误处理
try {
  const result = await someOperation();
  return result;
} catch (error) {
  if (error instanceof ValidationError) {
    throw new BadRequestError('数据验证失败', error);
  }
  throw new InternalServerError('操作失败', error);
}
```

## 架构规范

### Monorepo 架构

```
PetShopManagement/
├── apps/                    # 应用层
│   ├── api/                # 后端API服务 (Express + Prisma)
│   │   ├── src/
│   │   │   ├── routes/     # 路由层 - 处理HTTP请求
│   │   │   ├── services/   # 业务逻辑层 - 核心业务逻辑
│   │   │   ├── middleware/ # 中间件层 - 认证、验证等
│   │   │   └── prisma/     # 数据库层 - Prisma schema和迁移
│   │   └── package.json
│   └── web/                # 前端Web应用 (React + Vite)
│       ├── src/
│       │   ├── pages/      # 页面组件
│       │   ├── components/ # 可复用组件
│       │   ├── hooks/      # 自定义React Hooks
│       │   ├── lib/        # 工具库和配置
│       │   └── types/      # 类型定义
│       └── package.json
├── packages/                # 共享包
│   ├── shared/             # 共享类型和工具
│   │   └── src/
│   │       └── types/      # 共享类型定义
│   └── ui/                 # 共享UI组件库
└── package.json            # 根工作区配置
```

### 应用层架构

#### API 服务架构

```
apps/api/src/
├── routes/          # 路由层 - 处理HTTP请求
├── services/        # 业务逻辑层 - 核心业务逻辑
├── repositories/    # 数据访问层 - 数据库操作
├── middleware/      # 中间件层 - 认证、验证、日志
├── models/          # 数据模型层 - 实体和DTO
├── utils/           # 工具层 - 通用功能
└── prisma/          # 数据库层 - Prisma配置
```

#### Web 应用架构

```
apps/web/src/
├── pages/           # 页面层 - 路由页面组件
├── components/      # 组件层 - 可复用UI组件
├── hooks/           # Hooks层 - 自定义React Hooks
├── lib/             # 工具库层 - 配置、API客户端等
├── types/           # 类型层 - TypeScript类型定义
└── auth/            # 认证层 - 认证相关组件和逻辑
```

### 依赖注入

```typescript
// ✅ 使用依赖注入
class PetService {
  constructor(
    private petRepository: PetRepository,
    private logger: Logger
  ) {}
}

// ❌ 避免直接实例化
class PetService {
  private petRepository = new PetRepository();
}
```

### 接口优先

```typescript
// 定义接口
interface IPetRepository {
  findById(id: string): Promise<Pet | null>;
  create(pet: CreatePetDto): Promise<Pet>;
}

// 实现接口
class PetRepository implements IPetRepository {
  async findById(id: string): Promise<Pet | null> {
    // 实现逻辑
  }
}
```

### Monorepo 包管理规范

#### 包命名规范

```json
{
  "name": "@petshop/api", // 后端API服务
  "name": "@petshop/web", // 前端Web应用
  "name": "@petshop/shared", // 共享类型和工具
  "name": "@petshop/ui" // 共享UI组件
}
```

#### 依赖管理

```json
// 根package.json - 开发依赖
{
  "devDependencies": {
    "typescript": "^5.2.0",
    "eslint": "^8.57.0",
    "prettier": "^3.0.0"
  }
}

// 子包package.json - 运行时依赖
{
  "dependencies": {
    "@petshop/shared": "workspace:*"  // 使用workspace协议
  }
}
```

#### 脚本命令

```json
// 根package.json
{
  "scripts": {
    "dev": "pnpm --parallel -r dev", // 并行启动所有应用
    "build": "pnpm -r build", // 构建所有包
    "lint": "pnpm -r lint", // 检查所有包
    "type-check": "pnpm -r type-check" // 类型检查所有包
  }
}
```

## TypeScript 规范

### 类型定义

```typescript
// ✅ 明确的类型定义
interface CreatePetDto {
  name: string;
  species: PetSpecies;
  age: number;
  ownerId: string;
}

// ❌ 避免使用 any
function processPet(pet: any): any {
  // 类型不安全
}
```

### 泛型使用

```typescript
// ✅ 使用泛型提高复用性
class BaseRepository<T> {
  async findById(id: string): Promise<T | null> {
    // 通用实现
  }
}

class PetRepository extends BaseRepository<Pet> {
  // 继承通用功能
}
```

## 技术栈规范

### 后端技术栈 (API)

- **运行时**: Node.js + Express
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: Supabase Auth
- **开发工具**: TypeScript + tsx

### 前端技术栈 (Web)

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI库**: Material-UI (MUI) + Tailwind CSS
- **状态管理**: React Query (TanStack Query)
- **路由**: React Router DOM
- **HTTP客户端**: Axios

### 共享包

- **类型定义**: 在 `packages/shared` 中定义
- **工具函数**: 通用工具和常量
- **UI组件**: 在 `packages/ui` 中定义

## 数据库规范

### Prisma Schema

```prisma
// ✅ 清晰的模型定义
model Pet {
  id        String   @id @default(cuid())
  name      String
  species   PetSpecies
  age       Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 关系定义
  owner     User     @relation(fields: [ownerId], references: [id])
  ownerId   String

  @@map("pets") // 明确表名
}
```

### 查询优化

```typescript
// ✅ 使用 Prisma 的优化功能
const pets = await prisma.pet.findMany({
  where: { ownerId: userId },
  include: { owner: true },
  orderBy: { createdAt: 'desc' },
  take: 10,
});
```

## 测试规范

### 单元测试

```typescript
// ✅ 测试文件命名：*.test.ts 或 *.spec.ts
describe('PetService', () => {
  let petService: PetService;
  let mockPetRepository: jest.Mocked<PetRepository>;

  beforeEach(() => {
    mockPetRepository = createMockPetRepository();
    petService = new PetService(mockPetRepository);
  });

  it('should create pet successfully', async () => {
    // 测试逻辑
  });
});
```

## 性能优化

### 异步处理

```typescript
// ✅ 使用 Promise.all 并行处理
const [pets, owners] = await Promise.all([
  petRepository.findAll(),
  ownerRepository.findAll(),
]);

// ❌ 避免串行处理
const pets = await petRepository.findAll();
const owners = await ownerRepository.findAll();
```

### 缓存策略

```typescript
// ✅ 实现缓存机制
class CachedPetService {
  private cache = new Map<string, Pet>();

  async findById(id: string): Promise<Pet | null> {
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    const pet = await this.petRepository.findById(id);
    if (pet) {
      this.cache.set(id, pet);
    }
    return pet;
  }
}
```

## 安全规范

### 输入验证

```typescript
// ✅ 使用 Zod 进行输入验证
import { z } from 'zod';

const CreatePetSchema = z.object({
  name: z.string().min(1).max(50),
  species: z.enum(['dog', 'cat', 'bird']),
  age: z.number().min(0).max(30),
});

// 在路由中使用
const validatedData = CreatePetSchema.parse(req.body);
```

### 权限控制

```typescript
// ✅ 实现角色基础访问控制
@RoleGuard(['admin', 'veterinarian'])
async function updatePet(id: string, data: UpdatePetDto): Promise<Pet> {
  // 只有管理员和兽医可以更新宠物信息
}
```

## React 组件规范

### 组件设计原则

```typescript
// ✅ 函数组件 + TypeScript
interface PetCardProps {
  pet: Pet
  onEdit?: (pet: Pet) => void
  onDelete?: (id: string) => void
}

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  onEdit,
  onDelete
}) => {
  // 组件逻辑
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{pet.name}</Typography>
        <Typography>{pet.species}</Typography>
      </CardContent>
    </Card>
  )
}
```

### Hooks 使用规范

```typescript
// ✅ 自定义Hook
export const usePet = (petId: string) => {
  const { data: pet, isLoading, error } = useQuery({
    queryKey: ['pet', petId],
    queryFn: () => petApi.getById(petId)
  })

  return { pet, isLoading, error }
}

// ✅ 在组件中使用
const PetDetails: React.FC<{ petId: string }> = ({ petId }) => {
  const { pet, isLoading, error } = usePet(petId)

  if (isLoading) return <CircularProgress />
  if (error) return <ErrorAlert error={error} />
  if (!pet) return <NotFound />

  return <PetCard pet={pet} />
}
```

## Express 路由规范

### 路由组织

```typescript
// ✅ 路由文件结构
// apps/api/src/routes/pets.ts
import { Router } from 'express';
import { PetController } from '../controllers/PetController';
import { authMiddleware } from '../middleware/auth';
import { validatePet } from '../middleware/validation';

const router = Router();
const petController = new PetController();

router.get('/', authMiddleware, petController.getAllPets);
router.post('/', authMiddleware, validatePet, petController.createPet);
router.get('/:id', authMiddleware, petController.getPetById);
router.put('/:id', authMiddleware, validatePet, petController.updatePet);
router.delete('/:id', authMiddleware, petController.deletePet);

export default router;
```

### 控制器设计

```typescript
// ✅ 控制器类
export class PetController {
  constructor(private petService: PetService) {}

  async getAllPets(req: Request, res: Response): Promise<void> {
    try {
      const pets = await this.petService.getAllPets();
      res.json({ success: true, data: pets });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: '获取宠物列表失败',
      });
    }
  }
}
```

## Git 提交规范

### 提交消息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 类型说明

- **feat**: 新功能
- **fix**: 修复bug
- **docs**: 文档更新
- **style**: 代码格式调整
- **refactor**: 代码重构
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动

### 示例

```
feat(pets): add pet search functionality

- Implement search by name, species, and age
- Add pagination support
- Include owner information in search results

Closes #123
```

### 重要规范要求

**⚠️ 严格禁止在 commit message 中提及 AI 相关内容**

- ❌ 不要写 "AI generated"、"AI assisted"、"AI helped" 等
- ❌ 不要写 "Generated by AI"、"AI coding" 等
- ❌ 不要写任何暗示代码由AI生成的内容
- ✅ 保持提交消息的专业性和通用性
- ✅ 描述具体的功能变更和实现细节

**原因**: 保持代码提交的专业形象，避免暴露开发工具信息

## 代码审查清单

### 功能完整性

- [ ] 功能需求是否完整实现
- [ ] 边界情况是否处理
- [ ] 错误处理是否完善

### 代码质量

- [ ] 是否符合SOLID原则
- [ ] 是否有重复代码
- [ ] 函数是否过于复杂
- [ ] 命名是否清晰

### 性能考虑

- [ ] 是否有不必要的数据库查询
- [ ] 是否使用了适当的缓存策略
- [ ] 异步操作是否合理

### 安全性

- [ ] 输入验证是否充分
- [ ] 权限控制是否正确
- [ ] 敏感信息是否暴露

## 工具配置

### ESLint 规则

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-unused-vars": "error"
  }
}
```

### Prettier 配置

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

## 持续改进

- 定期回顾代码规范
- 收集团队反馈
- 学习行业最佳实践
- 更新工具和依赖

---

**注意**: 本规范文档应定期更新，确保与项目发展保持一致。
