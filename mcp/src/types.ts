export interface Task {
  id: string;
  title: string;
  prompt: string;
  human_id: string | null;
  response_body: string | null;
  time_submitted: string;
  time_completed: string | null;
  time_allowed_to_complete: number;
  options: string[] | null;
  created_at: string;
  updated_at: string;
}

// API Request/Response types (snake_case for API layer)
export interface CreateTaskAPIRequest {
  title: string;
  prompt: string;
  time_allowed_to_complete: number;
  options?: string[];
}

export interface CreateTaskAPIResponse {
  task: Task;
}

export interface GetTasksAPIResponse {
  tasks: Task[];
}

// MCP Tool argument types (camelCase for MCP layer)
export interface SubmitTaskMCPArgs {
  title: string;
  prompt: string;
  timeInSeconds: number;
  options?: string[];
}

export interface CheckTaskStatusMCPArgs {
  taskId: string;
}

export interface SubmitReviewMCPArgs {
  taskId: string;
  feedback: string;
  score: number;
}
