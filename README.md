# UIGen

AI-powered React component generator with live preview.

## Prerequisites

- Node.js 18+
- npm

## Setup

1. **Optional** Edit `.env` and configure your AI provider:

The project supports multiple AI providers. Choose one of the following:

### Option A: Zhipu GLM (智谱 AI)

```env
ANTHROPIC_API_KEY=your-zhipu-api-key
ANTHROPIC_BASE_URL=https://open.bigmodel.cn/api/anthropic/v1
ANTHROPIC_MODEL=glm-5
```

Get your API key from [智谱 AI 开放平台](https://open.bigmodel.cn/).

### Option B: Anthropic Claude

```env
ANTHROPIC_API_KEY=your-anthropic-api-key
# ANTHROPIC_BASE_URL=  (leave empty for default)
ANTHROPIC_MODEL=claude-sonnet-4-5
```

Get your API key from [Anthropic](https://www.anthropic.com/).

### Option C: No API Key (Mock Mode)

If you don't configure an API key, the project will run in mock mode and return static, predefined components instead of using an LLM.

2. Install dependencies and initialize database

```bash
npm run setup
```

This command will:

- Install all dependencies
- Generate Prisma client
- Run database migrations

## Running the Application

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Sign up or continue as anonymous user
2. Describe the React component you want to create in the chat
3. View generated components in real-time preview
4. Switch to Code view to see and edit the generated files
5. Continue iterating with the AI to refine your components

## Features

- AI-powered component generation using Claude or GLM
- Live preview with hot reload
- Virtual file system (no files written to disk)
- Syntax highlighting and code editor
- Component persistence for registered users
- Export generated code

## Tech Stack

- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Prisma with SQLite
- Anthropic Claude / Zhipu GLM AI
- Vercel AI SDK
