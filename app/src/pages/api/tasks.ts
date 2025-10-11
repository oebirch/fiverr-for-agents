import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import type { CreateTaskInput, Task } from '@/types/task';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    return createTask(req, res);
  }

  if (req.method === 'GET') {
    return getTasks(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function createTask(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Creating task with body:', JSON.stringify(req.body).substring(0, 200));
    const { prompt, time_allowed_to_complete, options } = req.body as CreateTaskInput;

    if (!prompt || !time_allowed_to_complete) {
      return res.status(400).json({
        error: 'prompt and time_allowed_to_complete are required'
      });
    }

    // Validate options if provided
    if (options !== undefined) {
      if (!Array.isArray(options)) {
        return res.status(400).json({
          error: 'options must be an array of strings'
        });
      }
      if (options.length > 10) {
        return res.status(400).json({
          error: 'options array cannot exceed 10 items'
        });
      }
      if (!options.every(opt => typeof opt === 'string')) {
        return res.status(400).json({
          error: 'all options must be strings'
        });
      }
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          prompt,
          time_allowed_to_complete,
          time_submitted: new Date().toISOString(),
          options: options ?? null,
        },
      ])
      .select()
      .single<Task>();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ task: data });
  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getTasks(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { human_id } = req.query;

    let query = supabase
      .from('tasks')
      .select('*')
      .order('time_submitted', { ascending: false });

    if (human_id) {
      query = query.eq('human_id', human_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ tasks: data });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
