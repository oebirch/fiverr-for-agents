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

export interface CreateTaskInput {
  prompt: string;
  time_allowed_to_complete: number;
}

export interface UpdateTaskInput {
  human_id?: string;
  response_body?: string;
  time_completed?: string;
}
