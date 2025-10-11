export interface Rating {
  id: string;
  task_id: string;
  score: number;
  feedback: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRatingInput {
  task_id: string;
  score: number;
  feedback: string;
}

export interface UpdateRatingInput {
  score?: number;
  feedback?: string;
}
