# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a "Fiverr for Agents" hackathon project consisting of two main components:
- **MCP Server** (`mcp/`): A Model Context Protocol server that provides tools for AI agents to submit tasks to humans
- **Next.js Web App** (`app/`): A T3 Stack application for the web interface

## Repository Structure

The project is organized as a monorepo with two independent packages:

### MCP Server (`mcp/`)
- **Purpose**: Enables AI agents (like Claude) to delegate tasks to human workers
- **Entry point**: `src/index.ts`
- **Key tools provided**:
  - `get-human-task-menu`: Fetches available human tasks
  - `submit-task`: Submits a task for human completion
  - `check-task-status`: Polls task completion status
  - `submit-review`: Allows agents to rate human responses
- **Prompts**: Includes `get-human-task-menu` prompt to fetch and order tasks by conversation relevance
- **Current state**: Mock implementation - API calls are stubbed with placeholder responses

### Next.js App (`app/`)
- **Framework**: T3 Stack (Next.js + tRPC + TypeScript)
- **Router**: Uses Pages Router (`src/pages/`) - note there's also an `app/` subdirectory that appears experimental
- **API Layer**: tRPC with router defined in `src/server/api/root.ts`
- **Database**: Currently uses mocked in-memory data (see `src/server/api/routers/post.ts`)
- **Styling**: Tailwind CSS
- **Package manager**: Yarn

## Common Commands

### MCP Server
```bash
cd mcp
npm install                    # Install dependencies
npm run build                  # Compile TypeScript
npm run watch                  # Watch mode for development
node dist/index.js             # Run the MCP server directly
```

To connect MCP server to Claude Desktop, add to `~/Library/Application Support/Claude/claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "fiverr-for-agents": {
      "command": "node",
      "args": ["/Users/oebirch/Documents/development.nosync/hackathon/fiverr-for-agents/mcp/dist/index.js"]
    }
  }
}
```

### Next.js App
```bash
cd app
yarn install                   # Install dependencies
yarn dev                       # Start dev server with Turbo (default port 3000)
yarn build                     # Build for production
yarn start                     # Start production server
yarn lint                      # Run ESLint
yarn lint:fix                  # Fix ESLint issues automatically
yarn typecheck                 # Run TypeScript type checking
yarn check                     # Run both lint and typecheck
yarn format:check              # Check code formatting with Prettier
yarn format:write              # Auto-format code with Prettier
```

## Architecture Notes

### MCP Server Architecture
- Built on `@modelcontextprotocol/sdk` v1.0.4
- Uses stdio transport for communication with Claude Desktop
- All tool handlers in `mcp/src/index.ts` currently return mock data
- Task IDs are generated with timestamp: `task-${Date.now()}`
- Task completion is randomly simulated (50% chance in `check-task-status`)

### Next.js App Architecture
- **tRPC Setup**: API routes defined in `src/server/api/routers/`, composed in `src/server/api/root.ts`
- **Context**: tRPC context in `src/server/api/trpc.ts` is minimal - no auth or database currently
- **Environment Variables**: Validated using `@t3-oss/env-nextjs` in `src/env.js`
- **Client-side tRPC**: Initialized in `src/utils/api.ts` and used via React Query hooks
- **Timing Middleware**: tRPC includes artificial delay (100-500ms) in development to simulate network latency

### Data Flow (Intended Architecture)
1. AI agent uses MCP tools to submit tasks to humans
2. Tasks should be stored in a backend (currently mocked)
3. Web app displays tasks to human workers
4. Humans complete tasks through the web interface
5. AI agent polls for completion and retrieves results
6. AI agent submits review/rating

### Current State
- MCP server has full tool definitions but mocked responses
- Web app has T3 Stack scaffolding but minimal custom implementation
- No real database integration yet (post router uses in-memory array)
- No actual API connection between MCP server and web app

## Development Notes

- The project uses Supabase (`@supabase/supabase-js` dependency in app)
- Environment variables are validated with Zod schemas
- Both packages are TypeScript with strict type checking
- MCP server logs to stderr (console.error) to avoid interfering with stdio protocol
