#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type {
  SubmitTaskArgs,
  CheckTaskStatusArgs,
  SubmitReviewArgs,
  CreateTaskRequest,
  CreateTaskResponse,
} from "./types.js";

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
      {
        name: "check-task-completion",
        description: "Check if a submitted task has been completed by a human. The LLM will automatically find the task ID from the conversation history.",
      },
    ],
  };
});

// Handle prompt requests
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

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

  if (name === "check-task-completion") {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Please check if my task has been completed. First, find the last task ID that was used in our conversation history (it should be a UUID returned from a submit-task call). Then use the check-task-status tool with that task ID to get the current status.

IF THE TASK IS COMPLETED:
1. You MUST immediately use the submit-review tool to assess the human's response (score 0-10 and provide detailed feedback)
2. Then show me BOTH:
   - The human's response
   - Your review assessment (the score and feedback you submitted)

IF THE TASK IS IN PROGRESS:
- Let me know when to check back.`,
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
        description: "Submit a task for a human to complete. You must estimate how long the task should take (usually under 2 minutes / 120 seconds).",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description: "The prompt/instructions to give to the human. Be clear and specific about what you need.",
            },
            timeInSeconds: {
              type: "number",
              description: "Estimated time for the human to complete the task in seconds. Most tasks should be under 120 seconds (2 minutes).",
              maximum: 300,
              minimum: 10,
            },
          },
          required: ["prompt", "timeInSeconds"],
        },
      },
      {
        name: "check-task-status",
        description: "Check the status of a submitted task. IMPORTANT: If the task is completed, you MUST immediately submit a review using submit-review tool to assess the quality of the human's response before showing it to the user.",
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
        description: "Submit a review for a completed task. You must assess the human's response based on: quality, completeness, helpfulness, and relevance to the original request. This is REQUIRED after receiving a completed task.",
        inputSchema: {
          type: "object",
          properties: {
            taskId: {
              type: "string",
              description: "The ID of the task to review",
            },
            feedback: {
              type: "string",
              description: "Detailed written feedback about the human's response. Explain what was good or what could be improved.",
            },
            score: {
              type: "number",
              description: "Score out of 10 for the human's response. 10 = perfect, 7-9 = good, 4-6 = acceptable, 0-3 = poor",
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
    if (!args || typeof args !== 'object' || !('prompt' in args) || !('timeInSeconds' in args)) {
      throw new Error("Invalid arguments for submit-task");
    }
    const { prompt, timeInSeconds } = args as unknown as SubmitTaskArgs;

    try {
      // Call Next.js API to create task
      const requestBody: CreateTaskRequest = {
        prompt,
        time_allowed_to_complete: timeInSeconds,
      };

      const response = await fetch("http://localhost:3001/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create task");
      }

      const { task } = await response.json() as CreateTaskResponse;

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              taskId: task.id,
              message: `Task submitted successfully. Expected completion in ${timeInSeconds} seconds.`,
              prompt: task.prompt,
              time_submitted: task.time_submitted,
            }),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : "Unknown error occurred",
            }),
          },
        ],
      };
    }
  }

  if (name === "check-task-status") {
    if (!args || typeof args !== 'object' || !('taskId' in args)) {
      throw new Error("Invalid arguments for check-task-status");
    }
    const { taskId } = args as unknown as CheckTaskStatusArgs;

    try {
      // Call Next.js API to check task status
      const response = await fetch(`http://localhost:3001/api/tasks/${taskId}/status`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Task not found");
        }
        const error = await response.json();
        throw new Error(error.error || "Failed to check task status");
      }

      const data = await response.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : "Unknown error occurred",
            }),
          },
        ],
      };
    }
  }

  if (name === "submit-review") {
    if (!args || typeof args !== 'object' || !('taskId' in args) || !('feedback' in args) || !('score' in args)) {
      throw new Error("Invalid arguments for submit-review");
    }
    const { taskId, feedback, score } = args as unknown as SubmitReviewArgs;

    try {
      // Call Next.js API to submit review
      const response = await fetch("http://localhost:3001/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task_id: taskId,
          score,
          feedback,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit review");
      }

      const { rating } = await response.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              message: "Review submitted successfully",
              rating: {
                id: rating.id,
                task_id: rating.task_id,
                score: rating.score,
                feedback: rating.feedback,
                created_at: rating.created_at,
              },
            }),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : "Unknown error occurred",
            }),
          },
        ],
      };
    }
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
