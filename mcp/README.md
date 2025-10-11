# MCP Server

A Model Context Protocol (MCP) server for Claude Desktop.

## Setup

Install dependencies:

```bash
npm install
```

Build the server:

```bash
npm run build
```

## Development

Watch mode for automatic rebuilding:

```bash
npm run watch
```

## Testing Locally

Run the server directly:

```bash
node dist/index.js
```

## Connect to Claude Desktop

Add this configuration to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mcp-server": {
      "command": "node",
      "args": ["/Users/oebirch/Documents/development.nosync/hackathon/fiverr-for-agents/mcp/dist/index.js"]
    }
  }
}
```

Restart Claude Desktop to load the server.

## Customization

Edit `src/index.ts` to add your own tools and functionality. The example includes a simple `example_tool` that echoes messages.
