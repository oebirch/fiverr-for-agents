import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import type { CreateRatingInput, Rating } from '@/types/rating';
import type { Task } from '@/types/task';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    return createRating(req, res);
  }

  if (req.method === 'GET') {
    return getRatings(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function createRating(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { task_id, score, feedback } = req.body as CreateRatingInput;

    if (!task_id || score === undefined || !feedback) {
      return res.status(400).json({
        error: 'task_id, score, and feedback are required'
      });
    }

    if (score < 0 || score > 10) {
      return res.status(400).json({
        error: 'score must be between 0 and 10'
      });
    }

    // Check if task exists
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('id')
      .eq('id', task_id)
      .single<Pick<Task, 'id'>>();

    if (taskError || !task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { data, error } = await supabase
      .from('ratings')
      .insert([
        {
          task_id,
          score,
          feedback,
        },
      ])
      .select()
      .single<Rating>();

    if (error) {
      // Handle duplicate rating attempt
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Rating already exists for this task' });
      }
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ rating: data });
  } catch (error) {
    console.error('Error creating rating:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getRatings(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { task_id } = req.query;

    let query = supabase
      .from('ratings')
      .select('*, tasks(*)')
      .order('created_at', { ascending: false });

    if (task_id && typeof task_id === 'string') {
      query = query.eq('task_id', task_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ ratings: data });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
