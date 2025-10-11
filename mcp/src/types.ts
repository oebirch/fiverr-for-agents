export interface Task {
  id: string;
  prompt: string;
  human_id: string | null;
  response_body: string | null;
  time_submitted: string;
  time_completed: string | null;
  time_allowed_to_complete: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  prompt: string;
  time_allowed_to_complete: number;
}

export interface CreateTaskResponse {
  task: Task;
}

export interface GetTasksResponse {
  tasks: Task[];
}

export interface SubmitTaskArgs {
  prompt: string;
  timeInSeconds: number;
}

export interface CheckTaskStatusArgs {
  taskId: string;
}

export interface SubmitReviewArgs {
  taskId: string;
  feedback: string;
  score: number;
}
