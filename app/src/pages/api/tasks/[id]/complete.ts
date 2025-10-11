import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import type { Task } from '@/types/task';

interface CompleteTaskBody {
  response_body: string;
  human_id?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const { response_body, human_id } = req.body as CompleteTaskBody;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    if (!response_body) {
      return res.status(400).json({ error: 'response_body is required' });
    }

    // Update task as completed
    const { data: task, error } = await supabase
      .from('tasks')
      .update({
        response_body,
        human_id: human_id ?? null,
        time_completed: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single<Task>();

    if (error || !task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json({ task });
  } catch (error) {
    console.error('Error completing task:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
