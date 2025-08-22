# Pet Shop Management System

A comprehensive financial and appointment management system for offline pet shops, built with modern web technologies.

## 🏗️ Project Structure

```
petshop-management/
├── apps/
│   ├── web/                    # Frontend React application
│   └── api/                    # Backend Express API
├── packages/
│   ├── shared/                 # Shared types and utilities
│   └── ui/                     # Shared UI components (optional)
└── docs/                       # Documentation
```

## 🚀 Tech Stack

### Frontend (`apps/web`)

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **MUI (Material-UI)** - Component library
- **Tailwind CSS** - Utility-first CSS (supplemental)
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing

### Backend (`apps/api`)

- **Node.js + Express** - Server framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **SQLite** - Database (development)
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Development Tools

- **pnpm** - Package manager with workspace support
- **ESLint + Prettier** - Code linting and formatting
- **Husky + lint-staged** - Git hooks for code quality
- **TypeScript path aliases** - Clean imports

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **pnpm** (version 8 or higher)

```bash
# Install pnpm if you haven't already
npm install -g pnpm
```

## 🛠️ Installation & Setup

1. **Clone the repository and install dependencies:**

```bash
git clone <repository-url>
cd petshop-management
pnpm install
```

2. **Set up environment variables:**

```bash
# Copy environment templates
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

3. **Initialize the database:**

```bash
# Generate Prisma client and create database
cd apps/api
pnpm db:generate
pnpm db:push
cd ../..
```

4. **Set up Git hooks (optional but recommended):**

```bash
pnpm prepare
```

## 🚀 Development

### Start the development servers

```bash
# Start both frontend and backend concurrently
pnpm dev
```

This will start:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

### Individual commands

```bash
# Start only frontend
cd apps/web && pnpm dev

# Start only backend
cd apps/api && pnpm dev

# Build all packages
pnpm build

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code
pnpm format

# Type checking
pnpm type-check
```

## 🔧 Available Scripts

### Root Level

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages
- `pnpm lint` - Run ESLint on all packages
- `pnpm lint:fix` - Fix ESLint issues
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Run TypeScript type checking

### Frontend (`apps/web`)

- `pnpm dev` - Start Vite dev server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

### Backend (`apps/api`)

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build TypeScript to JavaScript
- `pnpm start` - Start production server
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Prisma Studio

## 🌐 API Endpoints

### Health Check

- `GET /healthz` - API health check
- `GET /api/healthz` - API health check (alternative route)

## 📝 Environment Variables

### Backend (`.env`)

```env
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
```

### Frontend (`.env`)

```env
VITE_API_URL=http://localhost:3000
```

## 🏗️ Project Architecture

### Workspace Configuration

This project uses **pnpm workspaces** for monorepo management. The workspace is configured in:

- `pnpm-workspace.yaml` - Workspace package definitions
- `package.json` - Root package configuration

### TypeScript Configuration

- **Path aliases** are configured for clean imports
- **Shared types** in `packages/shared` for type consistency
- **Build targets** optimized for each environment

### Code Quality

- **ESLint** with TypeScript rules
- **Prettier** for consistent formatting
- **Husky** Git hooks for pre-commit validation
- **lint-staged** for staged file processing

## 🚦 Verification

After setup, verify everything works:

1. **Frontend**: Visit http://localhost:5173
   - Should display "Hello PetShop"
   - Should show API connection status

2. **Backend**: Visit http://localhost:3000/healthz
   - Should return `{"status": "ok"}`

3. **Development workflow**:
   - Make a change to any file
   - Save and see hot reload
   - Commit changes to trigger pre-commit hooks

## 🔍 Troubleshooting

### Common Issues

1. **Port conflicts**:

   ```bash
   # Change ports in .env files if needed
   # Frontend: VITE_PORT in vite.config.ts
   # Backend: PORT in apps/api/.env
   ```

2. **Database issues**:

   ```bash
   # Reset database
   cd apps/api
   rm dev.db
   pnpm db:push
   ```

3. **Dependency issues**:

   ```bash
   # Clean install
   rm -rf node_modules
   rm pnpm-lock.yaml
   pnpm install
   ```

4. **TypeScript path issues**:
   ```bash
   # Rebuild shared packages
   cd packages/shared
   pnpm build
   ```

### Getting Help

- Check the console for detailed error messages
- Ensure all prerequisites are installed
- Verify environment variables are correctly set
- Try restarting the development servers

## 📚 Next Steps

This is a minimal viable setup. To extend the system:

1. Add more API endpoints in `apps/api/src/routes/`
2. Create new React components in `apps/web/src/components/`
3. Define shared types in `packages/shared/src/types/`
4. Add database models in `apps/api/prisma/schema.prisma`
5. Implement authentication and authorization
6. Add comprehensive testing setup

## 🤝 Contributing

1. Follow the established code style (ESLint + Prettier)
2. Add types for new features in the shared package
3. Write meaningful commit messages
4. Ensure all builds pass before submitting changes

---

**Happy coding! 🎉**
