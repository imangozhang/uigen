# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator web application. Users describe components in natural language, and the AI generates working React components with live preview. The app uses a virtual file system (no files written to disk) and supports both authenticated and anonymous usage.

## Development Commands

### Setup and Database
```bash
npm run setup              # Install dependencies, generate Prisma client, run migrations
npm run db:reset          # Reset database (deletes all data)
```

### Development
```bash
npm run dev               # Start development server with Turbopack (http://localhost:3000)
npm run dev:daemon        # Start dev server in background, logs to logs.txt
```

### Build and Production
```bash
npm run build             # Production build
npm run start             # Start production server
```

### Testing
```bash
npm test                  # Run all tests with Vitest
npm test -- <pattern>     # Run tests matching a pattern (e.g., npm test -- file-system)
```

### Code Quality
```bash
npm run lint              # Run ESLint
```

## Architecture

### Core Technology Stack
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **Prisma** with SQLite for data persistence
- **Vercel AI SDK** for AI integration
- **Monaco Editor** for code editing
- **Babel Standalone** for client-side JSX transformation

### Key Directories

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components (ui/, chat/, editor/, preview/, auth/)
- `src/lib/` - Core libraries and utilities
- `src/lib/contexts/` - React contexts (Chat, File System)
- `src/lib/tools/` - AI tool implementations
- `src/lib/transform/` - JSX transformation utilities
- `src/actions/` - Server actions
- `src/hooks/` - Custom React hooks

### Virtual File System

The application uses an in-memory virtual file system that persists to the database. Key files:
- `src/lib/file-system.ts` - Core file system implementation
- `src/lib/transform/` - Babel-based JSX/TSX transformation

**Important**: No files are ever written to the user's filesystem. All file operations are virtual and stored in the database.

### AI Integration

The app supports two modes:

1. **Real AI Mode** (requires `ANTHROPIC_API_KEY` in `.env`):
   - Uses Anthropic Claude or compatible APIs
   - Can configure custom base URL and model (e.g., Zhipu GLM-4.7)
   - Full AI-powered component generation

2. **Mock Mode** (no API key required):
   - Returns static, predefined components
   - Useful for development without API costs
   - See `src/lib/provider.ts:MockLanguageModel`

Environment variables:
```bash
ANTHROPIC_API_KEY=your-key          # Optional - enables real AI
ANTHROPIC_BASE_URL=https://...      # Optional - custom API endpoint
ANTHROPIC_MODEL=model-name          # Optional - override model
```

### AI Tools

The AI has access to two tools for file manipulation:
- `str_replace_editor` - Create and modify file contents
- `file_manager` - Rename/delete files and directories

Tools are defined in `src/lib/tools/` and used by the chat API route at `src/app/api/chat/route.ts`.

### Database Schema

Prisma schema at `prisma/schema.prisma`:
- `User` - User accounts with email/password
- `Project` - Projects with chat history (`messages`) and file system state (`data`)

Prisma client is generated to `src/generated/prisma/` (not the default location).

### Live Preview System

The preview system works by:
1. Transforming JSX/TSX code using Babel Standalone
2. Creating import maps for module resolution
3. Rendering in an iframe with error boundaries
4. Supporting `@/` alias for root directory imports

Key files:
- `src/components/preview/` - Preview components
- `src/lib/transform/` - Transformation logic

### Authentication

JWT-based authentication with cookies:
- `src/lib/auth.ts` - Authentication utilities
- `src/app/api/auth/` - Auth API routes
- Supports anonymous usage (no account required)

## Development Notes

### Node.js Compatibility
The app uses `node-compat.cjs` for Node.js 25+ compatibility. It fixes Web Storage SSR issues by removing non-functional localStorage/sessionStorage globals on the server. This file is required in all npm scripts via NODE_OPTIONS.

### Component Library
Base UI components in `src/components/ui/` are built with Radix UI and styled with Tailwind CSS using shadcn/ui (new-york style). Configuration in `components.json`.

### Server Actions
Server actions are located in `src/actions/` and handle database operations like project creation and retrieval.

### Import Aliases
- `@/` - Points to project root (`src/` directory)
- Configured in both Next.js and the preview system

### Testing
- Vitest with jsdom environment
- Testing Library for React components
- Test files co-located with source code (`.test.ts`, `.test.tsx`) or in `__tests__` directories
- Run specific test patterns: `npm test -- <pattern>`

### Common Patterns

1. **Adding new AI tools**: Define in `src/lib/tools/`, register in `src/app/api/chat/route.ts`
2. **Modifying file system**: Work with `src/lib/file-system.ts` and contexts in `src/lib/contexts/`
3. **Updating preview styles**: Modify `src/lib/transform/` to handle new CSS patterns
4. **Database changes**: Edit `prisma/schema.prisma`, run `npx prisma migrate dev`
5. **Adding server actions**: Create in `src/actions/`, export from `src/actions/index.ts`

## Environment Setup

1. Copy `.env` file and add API key (optional):
   ```bash
   ANTHROPIC_API_KEY=your-key-here
   ```

2. Run setup:
   ```bash
   npm run setup
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

The app will work without an API key using the mock provider.
