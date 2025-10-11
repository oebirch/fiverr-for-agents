#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Create server instance
const server = new Server(
  {
    name: "fiverr-for-agents",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
      prompts: {},
    },
  }
);

// List available prompts
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "get-human-task-menu",
        description: "Get the human task menu from Fiverr for Agents",
      },
    ],
  };
});

// Handle prompt requests
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name } = request.params;

  if (name === "get-human-task-menu") {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: "Please use the get-human-task-menu tool to fetch and show me the available human tasks. Please order the tasked based off the conversation history. Make sure the most relevant tasks are at the top of the list.",
          },
        },
      ],
    };
  }

  throw new Error(`Unknown prompt: ${name}`);
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get-human-task-menu",
        description: "Get available human tasks from the Fiverr for Agents marketplace",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "submit-task",
        description: "Submit a task for a human to complete",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "The prompt/instructions to give to the human",
            },
            timeInSeconds: {
              type: "number",
              description: "Expected time for the human to complete the task in seconds",
            },
          },
          required: ["prompt", "timeInSeconds"],
        },
      },
      {
        name: "check-task-status",
        description: "Check the status of a submitted task",
        inputSchema: {
          type: "object",
          properties: {
            taskId: {
              type: "string",
              description: "The ID of the task to check",
            },
          },
          required: ["taskId"],
        },
      },
      {
        name: "submit-review",
        description: "Submit a review for a completed task",
        inputSchema: {
          type: "object",
          properties: {
            taskId: {
              type: "string",
              description: "The ID of the task to review",
            },
            feedback: {
              type: "string",
              description: "Written feedback about the human's response",
            },
            score: {
              type: "number",
              description: "Score out of 10 for the human's response",
              minimum: 0,
              maximum: 10,
            },
          },
          required: ["taskId", "feedback", "score"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get-human-task-menu") {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            tasks: [
              {
                id: "take-photo",
                title: "Take a Photo",
                description: "Go and take a picture of something interesting",
                estimatedTime: 60
              },
              {
                id: "write-poem",
                title: "Write a Poem",
                description: "Write a creative poem on any topic",
                estimatedTime: 120
              },
              {
                id: "rate-pizza",
                title: "Rate My Pizza",
                description: "Tell me what you think of my homemade pizza (I'll send you a photo)",
                estimatedTime: 30
              },
            ],
          }),
        },
      ],
    };
  }

  if (name === "submit-task") {
    const { prompt, timeInSeconds } = args as { prompt: string; timeInSeconds: number };
    // TODO: Implement actual API call to submit task
    const taskId = `task-${Date.now()}`;

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            taskId,
            message: `Task submitted successfully. Expected completion in ${timeInSeconds} seconds.`,
            prompt,
          }),
        },
      ],
    };
  }

  if (name === "check-task-status") {
    const { taskId } = args as { taskId: string };
    // TODO: Implement actual API call to check task status
    // For now, return a mock completed response
    const isCompleted = Math.random() > 0.5; // Simulate 50% completion rate

    if (isCompleted) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: "completed",
              taskId,
              response: "Here is my response to your task! Check out this image: https://example.com/image.jpg",
              completedAt: new Date().toISOString(),
            }),
          },
        ],
      };
    } else {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              status: "in_progress",
              taskId,
              message: "The human is still working on the task",
            }),
          },
        ],
      };
    }
  }

  if (name === "submit-review") {
    const { taskId, feedback, score } = args as { taskId: string; feedback: string; score: number };
    // TODO: Implement actual API call to submit review

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            taskId,
            message: "Review submitted successfully",
            review: {
              feedback,
              score,
              submittedAt: new Date().toISOString(),
            },
          }),
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
