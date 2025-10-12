export interface Task {
  id: string;
  title: string | null;
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

export interface CreateTaskInput {
  title?: string;
  prompt: string;
  time_allowed_to_complete: number;
  options?: string[];
}

export interface UpdateTaskInput {
  human_id?: string;
  response_body?: string;
  time_completed?: string;
}
