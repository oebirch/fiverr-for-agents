import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import type { Task } from '@/types/task';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    // Fetch task from database
    const { data: task, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single<Task>();

    if (error || !task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if task is complete
    const isComplete = task.time_completed !== null && task.response_body !== null;

    if (isComplete) {
      return res.status(200).json({
        status: 'completed',
        task_id: task.id,
        prompt: task.prompt,
        response_body: task.response_body,
        time_submitted: task.time_submitted,
        time_completed: task.time_completed,
        time_allowed_to_complete: task.time_allowed_to_complete,
        human_id: task.human_id,
      });
    } else {
      return res.status(200).json({
        status: 'in_progress',
        task_id: task.id,
        prompt: task.prompt,
        time_submitted: task.time_submitted,
        time_allowed_to_complete: task.time_allowed_to_complete,
        human_id: task.human_id,
      });
    }
  } catch (error) {
    console.error('Error checking task status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
