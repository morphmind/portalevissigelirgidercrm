# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
```bash
bun dev          # Start development server (Vite frontend + local Worker backend)
bun run build    # Build for production
bun run lint     # Run ESLint with cache
bun run preview  # Build and preview production bundle locally
```

### Deployment
```bash
bun run deploy   # Build and deploy to Cloudflare Pages
bunx wrangler login  # Authenticate with Cloudflare (first time setup)
```

### Cloudflare
```bash
bun run cf-typegen  # Generate TypeScript types for Cloudflare bindings
```

## Architecture Overview

This is a **villa rental business financial dashboard** built as a full-stack application on Cloudflare's edge infrastructure, replacing traditional Excel spreadsheets with a modern web interface.

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite + React Router 6
- **UI Framework**: shadcn/ui components + Tailwind CSS + Framer Motion
- **Backend**: Cloudflare Workers + Hono framework
- **Storage**: Single Cloudflare Durable Object for all persistence
- **State Management**: TanStack Query for server state + Zustand (via React hooks)
- **Validation**: Zod schemas with Hono validators

### Core Architecture Patterns

#### 1. Cloudflare Worker Backend (`worker/`)
- **`worker/index.ts`** - Main Worker entry point (STRICTLY FORBIDDEN to modify)
- **`worker/user-routes.ts`** - Application API routes for transactions and categories
- **`worker/entities.ts`** - Durable Object entity wrappers (TransactionEntity, CategoryEntity)
- **`worker/core-utils.ts`** - Core utilities and HTTP helpers (DO NOT MODIFY)

**Critical Constraints:**
- Only ONE Durable Object binding: `GlobalDurableObject`
- Cannot modify `wrangler.jsonc` or add new bindings
- Must use Entity pattern, no direct Durable Object access
- All routes must follow the `/api/*` pattern

#### 2. React Frontend (`src/`)
```
src/
├── pages/              # Route components
│   ├── HomePage.tsx    # Main dashboard
│   ├── LoginPage.tsx   # Authentication
│   └── admin/          # Admin section
├── components/         # Reusable components
│   ├── ui/            # shadcn/ui components
│   ├── auth/          # Authentication components
│   └── ErrorBoundary.tsx
├── lib/               # Utilities and API client
├── hooks/             # Custom React hooks
└── main.tsx           # App entry point with router
```

#### 3. Type Safety (`shared/`)
- **`shared/types.ts`** - Shared TypeScript interfaces between frontend/backend
- All API responses use `ApiResponse<T>` wrapper
- Strict Zod validation on all API endpoints

### Financial Data Model

#### Core Entities
1. **Categories** - Income/Expense classification (e.g., Rent, Cleaning, Maintenance)
2. **Transactions** - Individual financial entries with amount, date, category
3. **Summary** - Calculated totals (income, expenses, net profit, current balance)

#### API Endpoints
```
GET    /api/categories              # List all categories
POST   /api/categories              # Create category
PUT    /api/categories/:id          # Update category
DELETE /api/categories/:id          # Delete category

GET    /api/transactions            # List transactions + summary
POST   /api/transactions            # Create transaction
PUT    /api/transactions/:id        # Update transaction
DELETE /api/transactions/:id        # Delete transaction

GET    /api/health                  # Health check
POST   /api/client-errors           # Error reporting
```

### Development Workflow

#### Project Structure Rules
- **UI Components**: Use existing shadcn/ui components, avoid custom UI components
- **Styling**: Use Tailwind classes; custom colors go in `tailwind.config.js` NOT `index.css`
- **Icons**: Import from `lucide-react` only
- **Routing**: React Router 6 with protected routes for authenticated sections
- **Error Handling**: Pre-implemented ErrorBoundary components handle errors

#### Code Patterns
- **Entity Operations**: Always use Entity classes (e.g., `TransactionEntity.create()`)
- **HTTP Responses**: Use `ok()`, `bad()`, `notFound()` helpers from `core-utils.ts`
- **Validation**: Zod schemas with `zValidator()` middleware
- **State Management**: TanStack Query for server state, React hooks for local state

#### Authentication Flow
- Login page (`/login`) → Protected routes
- `ProtectedRoute` component wraps authenticated pages
- Admin section (`/admin/*`) with nested routes for categories and reports

### Key Technical Details

#### Vite Configuration
- Path aliases: `@/` → `src/`, `@shared/` → `shared/`
- Cloudflare plugin for Worker integration
- Development proxy: `/api/*` requests proxy to local Worker

#### ESLint Configuration
- TypeScript + React rules
- Custom rules prevent state setter calls in render body
- Import resolution for TypeScript and Cloudflare Workers

#### Build Process
- Frontend builds to static assets for Cloudflare Pages
- Worker script builds separately and deploys with assets
- Single deployment command handles both frontend and backend

### Important Files to Never Modify
- `worker/index.ts` - Core Worker setup
- `worker/core-utils.ts` - Durable Object utilities
- `wrangler.jsonc` - Cloudflare configuration
- `src/main.tsx` - Router and provider setup (marked "Do not touch")

### Development Constraints
- Cannot add new Durable Objects or KV namespaces
- Must use provided Entity pattern for data operations
- Responsive design is required (desktop, tablet, mobile)
- Follow existing code organization patterns